// Import express
import express from 'express';

// Import dce-commonkit
import {
  ParamType,
  LogFunction,
  LOG_ROUTE_PATH,
  LOG_REVIEW_STATUS_ROUTE,
  LOG_REVIEW_GET_LOGS_ROUTE,
  SELECT_ADMIN_CHECK_ROUTE,
  ErrorWithCode,
} from 'dce-commonkit';

// Import shared helpers
import genRouteHandler from './genRouteHandler';
import getLogReviewerLogs from './getLogReviewerLogs';

// Import shared types
import ExpressKitErrorCode from '../types/ExpressKitErrorCode';

// Import shared helpers
import {
  internalGetLogCollection,
  internalGetLogReviewerAdminCollection,
} from './initExpressKitCollections';

/*------------------------------------------------------------------------*/
/*                                  Main                                  */
/*------------------------------------------------------------------------*/

/**
 * Prepare dce-commonkit to run on the server
 * @author Gabe Abrams
 * @param opts object containing all arguments
 * @param opts.app express app from inside of the postprocessor function that
 *   we will add routes to
 */
const initServer = (
  opts: {
    app: express.Application,
  },
) => {
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

    /* ------- Look Up Credential ------- */

    // Get the log reviewer admin collection
    const logReviewerAdminCollection = await internalGetLogReviewerAdminCollection();

    // Check if the user is in the log reviewer admin collection
    try {
      // Must be in the collection
      const matches = await logReviewerAdminCollection.find({ id: userId });

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
        // Destructure params
        const {
          userId,
          isAdmin,
        } = params;

        // Check if user can review logs
        const canReview = await canReviewLogs(userId, isAdmin);

        // Return result
        return canReview;
      },
    }),
  );

  /**
   * Get filtered logs based on provided filters
   * @author Gabe Abrams
   * @author Yuen Ler Chow
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

        // Get log collection
        const logCollection = await internalGetLogCollection();

        // Get logs
        const response = await getLogReviewerLogs({
          pageNumber,
          filters,
          countDocuments,
          logCollection,
        });

        // Return response
        return response;
      },
    }),
  );

  /*----------------------------------------*/
  /* --------- Select Admin Routes -------- */
  /*----------------------------------------*/

  /**
   * Check if the current user is a select admin
   * @author Gardenia Liu
   * @returns {boolean} true if user is a select admin. If the user is not
   *   a select admin, simply because this route starts with the select admin
   *   prefix, it will result in an error
   */
  opts.app.get(
    SELECT_ADMIN_CHECK_ROUTE,
    genRouteHandler({
      handler: async () => {
        return true;
      },
    }),
  );
};

export default initServer;
