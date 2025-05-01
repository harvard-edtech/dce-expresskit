// Import express
import express from 'express';

// Import dce-mango
import { Collection } from 'dce-mango';

// Import dce-reactkit
import {
  ErrorWithCode,
  ParamType,
  LogFunction,
  LOG_REVIEW_ROUTE_PATH_PREFIX,
  LOG_ROUTE_PATH,
  LOG_REVIEW_STATUS_ROUTE,
  Log,
} from 'dce-reactkit';

// Import shared helpers
import genRouteHandler from './genRouteHandler';

// Import shared types
import ExpressKitErrorCode from '../types/ExpressKitErrorCode';
import CrossServerCredential from '../types/CrossServerCredential';

// Import shared helpers
import {
  internalGetLogCollection,
} from './initExpressKitCollections';

// TODO: remove this
// Stored copy of dce-mango log collection
let _logCollection: Collection<Log>;

// TODO: remove this
// Stored copy of dce-mango cross-server credential collection
let _crossServerCredentialCollection: Collection<CrossServerCredential>;

/*------------------------------------------------------------------------*/
/*                                 Helpers                                */
/*------------------------------------------------------------------------*/

// TODO: remove this because we will use the getters in initExpressKitCollections instead
/**
 * Get log collection
 * @author Gabe Abrams
 * @returns log collection if one was included during launch or null if we don't
 *   have a log collection (yet)
 */
export const internalGetLogCollection = () => {
  return _logCollection ?? null;
};

// TODO: remove this because we will use the getters in initExpressKitCollections instead
/**
 * Get cross-server credential collection
 * @author Gabe Abrams
 * @return cross-server credential collection if one was included during launch or null
 *   if we don't have a cross-server credential collection (yet)
 */
export const internalGetCrossServerCredentialCollection = () => {
  return _crossServerCredentialCollection ?? null;
};

/*------------------------------------------------------------------------*/
/*                                  Main                                  */
/*------------------------------------------------------------------------*/

/**
 * Prepare dce-reactkit to run on the server
 * @author Gabe Abrams
 * @param opts object containing all arguments
 * @param opts.app express app from inside of the postprocessor function that
 *   we will add routes to
 * // TODO: remove opts.logCollection (don't need it)
 * @param [opts.logCollection] mongo collection from dce-mango to use for
 *   storing logs. If none is included, logs are written to the console
 * @param [opts.logReviewAdmins=all] info on which admins can review
 *   logs from the client. If not included, all Canvas admins are allowed to
 *   review logs. If null, no Canvas admins are allowed to review logs.
 *   If an array of Canvas userIds (numbers), only Canvas admins with those
 *   userIds are allowed to review logs. If a dce-mango collection, only
 *   Canvas admins with entries in that collection ({ userId, ...}) are allowed
 *   to review logs
 * // TODO: remove opts.crossServerCredentialCollection (don't need it)
 * @param [opts.crossServerCredentialCollection] mongo collection from dce-mango to use for
 *   storing cross-server credentials. If none is included, cross-server credentials
 *   are not supported
 */
const initServer = (
  opts: {
    app: express.Application,
    logReviewAdmins?: (number[] | Collection<any>),
    // TODO: Remove these collections:
    logCollection?: Collection<Log>,
    crossServerCredentialCollection?: Collection<CrossServerCredential>,
  },
) => {
  // TODO: Remove these collections:
  _logCollection = opts.logCollection;
  _crossServerCredentialCollection = opts.crossServerCredentialCollection;

  /*----------------------------------------*/
  /*                Logging                 */
  /*----------------------------------------*/

  /**
   * Log an event
   * @author Gabe Abrams
   * @param {string} context Context of the event (each app determines how to
   *   organize its contexts)
   * @param {string} subcontext Subcontext of the event (each app determines
   *   how to organize its subcontexts)
   * @param {string} tags stringified list of tags that apply to this action
   *   (each app determines tag usage)
   * @param {string} metadata stringified object containing optional custom metadata
   * @param {string} level log level
   * @param {string} [errorMessage] error message if type is an error
   * @param {string} [errorCode] error code if type is an error
   * @param {string} [errorStack] error stack if type is an error
   * @param {string} [target] Target of the action (each app determines the list
   *   of targets) These are usually buttons, panels, elements, etc.
   * @param {LogAction} [action] the type of action performed on the target
   * @returns {Log}
   */
  opts.app.post(
    LOG_ROUTE_PATH,
    genRouteHandler({
      paramTypes: {
        context: ParamType.String,
        subcontext: ParamType.String,
        tags: ParamType.JSON,
        level: ParamType.String,
        metadata: ParamType.JSON,
        errorMessage: ParamType.StringOptional,
        errorCode: ParamType.StringOptional,
        errorStack: ParamType.StringOptional,
        target: ParamType.StringOptional,
        action: ParamType.StringOptional,
      },
      handler: ({ params, logServerEvent }) => {
        // Create log info
        const logInfo: Parameters<LogFunction>[0] = (
          (params.errorMessage || params.errorCode || params.errorStack)
            // Error
            ? {
              context: params.context,
              subcontext: params.subcontext,
              tags: params.tags,
              level: params.level,
              metadata: params.metadata,
              error: {
                message: params.errorMessage,
                code: params.errorCode,
                stack: params.errorStack,
              },
            }
            // Action
            : {
              context: params.context,
              subcontext: params.subcontext,
              tags: params.tags,
              level: params.level,
              metadata: params.metadata,
              target: params.target,
              action: params.action,
            }
        );

        // Add hidden boolean to change source to "client"
        const logInfoForcedFromClient = {
          ...logInfo,
          overrideAsClientEvent: true,
        };

        // Write the log
        const log = logServerEvent(logInfoForcedFromClient);

        // Return
        return log;
      },
    }),
  );

  /*----------------------------------------*/
  /*              Log Reviewer              */
  /*----------------------------------------*/

  /**
   * Check if a given user is allowed to review logs
   * @author Gabe Abrams
   * @param userId the id of the user
   * @param isAdmin if true, the user is an admin
   * @returns true if the user can review logs
   */
  const canReviewLogs = async (
    userId: number,
    isAdmin: boolean,
  ): Promise<boolean> => {
    // Immediately deny access if user is not an admin
    if (!isAdmin) {
      return false;
    }

    // If all admins are allowed, we're done
    if (!opts.logReviewAdmins) {
      return true;
    }

    // Do a dynamic check
    try {
      // Array of userIds
      if (Array.isArray(opts.logReviewAdmins)) {
        return opts.logReviewAdmins.some((allowedId) => {
          return (userId === allowedId);
        });
      }

      // Must be a collection
      const matches = await opts.logReviewAdmins.find({ userId });

      // Make sure at least one entry matches
      return matches.length > 0;
    } catch (err) {
      // If an error occurred, simply return false
      return false;
    }
  };

  /**
   * Check if the current user has access to logs
   * @author Gabe Abrams
   * @returns {boolean} true if user has access
   */
  opts.app.get(
    LOG_REVIEW_STATUS_ROUTE,
    genRouteHandler({
      handler: async ({ params }) => {
        const { userId, isAdmin } = params;
        const canReview = await canReviewLogs(userId, isAdmin);
        return canReview;
      },
    }),
  );

  /**
   * Get all logs for a certain month
   * @author Gabe Abrams
   * @param {number} year the year to query (e.g. 2022)
   * @param {number} month the month to query (e.g. 1 = January)
   * @returns {Log[]} list of logs from the given month
   */
  opts.app.get(
    `${LOG_REVIEW_ROUTE_PATH_PREFIX}/years/:year/months/:month`,
    genRouteHandler({
      paramTypes: {
        year: ParamType.Int,
        month: ParamType.Int,
        pageNumber: ParamType.Int,
      },
      handler: async ({ params }) => {
        // Get user info
        const {
          year,
          month,
          pageNumber,
          userId,
          isAdmin,
        } = params;

        // Validate user
        const canReview = await canReviewLogs(userId, isAdmin);
        if (!canReview) {
          throw new ErrorWithCode(
            'You cannot access this resource because you do not have the appropriate permissions.',
            ExpressKitErrorCode.NotAllowedToReviewLogs,
          );
        }

        // Get log collection
        const logCollection = internalGetLogCollection();

        // Query for logs
        const response = await logCollection.findPaged({
          query: {
            year,
            month,
          },
          perPage: 1000,
          pageNumber,
        });

        // Return response
        return response;
      },
    }),
  );
};

export default initServer;
