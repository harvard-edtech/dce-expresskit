// Import express
import express from 'express';

// Import dce-mango
import { Collection } from 'dce-mango';

// Import dce-reactkit
import {
  ParamType,
  LogFunction,
  LOG_ROUTE_PATH,
  LOG_REVIEW_STATUS_ROUTE,
  Log,
  LOG_REVIEW_GET_LOGS_ROUTE,
  ErrorWithCode,
} from 'dce-reactkit';

// Import shared helpers
import genRouteHandler from './genRouteHandler';
import getLogReviewerLogs from './getLogReviewerLogs';

// Import shared types
import ExpressKitErrorCode from '../types/ExpressKitErrorCode';
import CrossServerCredential from '../types/CrossServerCredential';

// Stored copy of dce-mango log collection
let _logCollection: Collection<Log>;

// Stored copy of dce-mango cross-server credential collection
let _crossServerCredentialCollection: Collection<CrossServerCredential>;

/*------------------------------------------------------------------------*/
/*                                 Helpers                                */
/*------------------------------------------------------------------------*/

/**
 * Get log collection
 * @author Gabe Abrams
 * @returns log collection if one was included during launch or null if we don't
 *   have a log collection (yet)
 */
export const internalGetLogCollection = () => {
  return _logCollection ?? null;
};

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
 * @param opts.getLaunchInfo CACCL LTI's get launch info function
 * @param [opts.logCollection] mongo collection from dce-mango to use for
 *   storing logs. If none is included, logs are written to the console
 * @param [opts.logReviewAdmins=all] info on which admins can review
 *   logs from the client. If not included, all Canvas admins are allowed to
 *   review logs. If null, no Canvas admins are allowed to review logs.
 *   If an array of Canvas userIds (numbers), only Canvas admins with those
 *   userIds are allowed to review logs. If a dce-mango collection, only
 *   Canvas admins with entries in that collection ({ userId, ...}) are allowed
 *   to review logs
 * @param [opts.crossServerCredentialCollection] mongo collection from dce-mango to use for
 *   storing cross-server credentials. If none is included, cross-server credentials
 *   are not supported
 */
const initServer = (
  opts: {
    app: express.Application,
    logReviewAdmins?: (number[] | Collection<any>),
    logCollection?: Collection<Log>,
    crossServerCredentialCollection?: Collection<CrossServerCredential>,
  },
) => {
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
   * Get filtered logs based on provided filters
   * @author Gabe Abrams, Yuen Ler Chow
   * @param pageNumber the page number to get
   * @param filters the filters to apply to the logs
   * @returns {Log[]} list of logs that match the filters
   */
  opts.app.get(
    LOG_REVIEW_GET_LOGS_ROUTE,
    genRouteHandler({
      paramTypes: {
        pageNumber: ParamType.Int,
        filters: ParamType.JSON,
        countDocuments: ParamType.Boolean,
      },
      handler: async ({ params }) => {
        // Destructure params
        const {
          pageNumber,
          userId,
          isAdmin,
          filters,
          countDocuments,
        } = params;

        // Validate user
        const canReview = await canReviewLogs(userId, isAdmin);
        if (!canReview) {
          throw new ErrorWithCode(
            'You cannot access this resource because you do not have the appropriate permissions.',
            ExpressKitErrorCode.NotAllowedToReviewLogs,
          );
        }

        // Get logs
        const response = await getLogReviewerLogs({
          pageNumber,
          filters,
          countDocuments,
          logCollection: _logCollection,
        });

        // Return response
        return response;
      },
    }),
  );
};

export default initServer;
