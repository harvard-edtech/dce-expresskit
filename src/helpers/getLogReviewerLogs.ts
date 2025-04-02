// Import dce-reactkit
import {  
  DAY_IN_MS,
  Log,
  LogReviewerFilterState, 
  LogType 
} from 'dce-reactkit';

// Import shared types
import LOG_REVIEW_PAGE_SIZE from '../constants/LOG_REVIEW_PAGE_SIZE';
import { Collection } from 'dce-mango';

/**
 * Get logs for the log reviewer interface
 * @author Yuen Ler Chow
 * @param opts object containing all arguments
 * @param opts.pageNumber the page number to retrieve (1-indexed)
 * @param opts.filters filter criteria for logs
 * @param opts.countDocuments if true, count number of documents matching
 *   filters and return num pages (not always required because if changing pages,
 *   we don't need to recount documents)
 * @param opts.logCollection MongoDB collection containing logs
 * @returns object with logs for the requested page and optionally total number of pages
 */
const getLogReviewerLogs = async (
  opts: {
    pageNumber: number,
    filters: LogReviewerFilterState,
    countDocuments: boolean,
    logCollection: Collection<Log>,
  },
) => {

  // Destructure opts
  const {
    pageNumber,
    filters,
    countDocuments,
    logCollection,
  } = opts;
  

  // Destructure filters
  const {
    dateFilterState,
    contextFilterState,
    tagFilterState,
    actionErrorFilterState,
    advancedFilterState,
  } = filters as LogReviewerFilterState;

  // Build MongoDB query based on filters
  const query: { [k: string]: any } = {};

  /* -------------- Date Filter ------------- */

  // Convert start and end dates from the dateFilterState into timestamps
  const { startDate, endDate } = dateFilterState;
  const startTimestamp = new Date(
    `${startDate.month}/${startDate.day}/${startDate.year}`,
  ).getTime();
  const endTimestamp = (
    (new Date(`${endDate.month}/${endDate.day}/${endDate.year}`)).getTime()
    + DAY_IN_MS
  );

  // Add a date range condition to the query
  query.timestamp = {
    $gte: startTimestamp,
    $lt: endTimestamp,
  };

  /* ------------ Context Filter ------------ */

  // Process context filters to include selected contexts and subcontexts
  const contextConditions: { [k: string]: any }[] = [];
  Object.keys(contextFilterState).forEach((context) => {
    const value = contextFilterState[context];
    if (typeof value === 'boolean') {
      if (value) {
        // The entire context is selected
        contextConditions.push({ context });
      }
    } else {
      // The context has subcontexts
      const subcontexts = Object.keys(value).filter((subcontext) => {
        return value[subcontext];
      });

      if (subcontexts.length > 0) {
        contextConditions.push({
          context,
          subcontext: { $in: subcontexts },
        });
      }
    }
  });
  if (contextConditions.length > 0) {
    query.$or = contextConditions;
  }

  /* -------------- Tag Filter -------------- */

  const selectedTags = Object.keys(tagFilterState).filter((tag) => { return tagFilterState[tag]; });
  if (selectedTags.length > 0) {
    query.tags = { $in: selectedTags };
  }

  /* --------- Action/Error Filter ---------- */

  if (actionErrorFilterState.type) {
    query.type = actionErrorFilterState.type;
  }

  if (actionErrorFilterState.type === LogType.Error) {
    if (actionErrorFilterState.errorMessage) {
      // Add error message to the query.
      // $i is used for case-insensitive search, and $regex is used for partial matching
      query.errorMessage = {
        $regex: actionErrorFilterState.errorMessage,
        $options: 'i',
      };
    }

    if (actionErrorFilterState.errorCode) {
      query.errorCode = {
        $regex: actionErrorFilterState.errorCode,
        $options: 'i',
      };
    }
  }

  if (actionErrorFilterState.type === LogType.Action) {
    const selectedTargets = (
      Object.keys(actionErrorFilterState.target)
        .filter((target) => {
          return actionErrorFilterState.target[target];
        })
    );
    const selectedActions = (
      Object.keys(actionErrorFilterState.action)
        .filter((action) => {
          return actionErrorFilterState.action[action];
        })
    );
    if (selectedTargets.length > 0) {
      query.target = { $in: selectedTargets };
    }
    if (selectedActions.length > 0) {
      query.action = { $in: selectedActions };
    }
  }

  /* ------------ Advanced Filter ----------- */

  if (advancedFilterState.userFirstName) {
    query.userFirstName = {
      $regex: advancedFilterState.userFirstName,
      $options: 'i',
    };
  }

  if (advancedFilterState.userLastName) {
    query.userLastName = {
      $regex: advancedFilterState.userLastName,
      $options: 'i',
    };
  }

  if (advancedFilterState.userEmail) {
    query.userEmail = {
      $regex: advancedFilterState.userEmail,
      $options: 'i',
    };
  }

  if (advancedFilterState.userId) {
    query.userId = Number.parseInt(advancedFilterState.userId, 10);
  }

  const roles: {
    isLearner?: boolean,
    isTTM?: boolean,
    isAdmin?: boolean,
  }[] = [];
  if (advancedFilterState.includeLearners) {
    roles.push({ isLearner: true });
  }
  if (advancedFilterState.includeTTMs) {
    roles.push({ isTTM: true });
  }
  if (advancedFilterState.includeAdmins) {
    roles.push({ isAdmin: true });
  }
  // If any roles are selected, add them to the query
  if (roles.length > 0) {
    // The $or operator is used to match any of the roles
    // The $and operator is to ensure that other conditions in the query are met
    query.$and = [{ $or: roles }];
  }

  if (advancedFilterState.courseId) {
    query.courseId = Number.parseInt(advancedFilterState.courseId, 10);
  }

  if (advancedFilterState.courseName) {
    query.courseName = {
      $regex: advancedFilterState.courseName,
      $options: 'i',
    };
  }

  if (advancedFilterState.isMobile !== undefined) {
    query['device.isMobile'] = Boolean(advancedFilterState.isMobile);
  }

  if (advancedFilterState.source) {
    query.source = advancedFilterState.source;
  }

  if (advancedFilterState.routePath) {
    query.routePath = {
      $regex: advancedFilterState.routePath,
      $options: 'i',
    };
  }

  if (advancedFilterState.routeTemplate) {
    query.routeTemplate = {
      $regex: advancedFilterState.routeTemplate,
      $options: 'i',
    };
  }

  // Query for logs
  const response = await logCollection.findPaged({
    query,
    perPage: LOG_REVIEW_PAGE_SIZE,
    pageNumber,
    sortDescending: true,
  });

  // Count documents if requested
  if (countDocuments) {
    const numPages = Math.ceil(
      await logCollection.count(query)
      / LOG_REVIEW_PAGE_SIZE
  );
    return {
      ...response,
      numPages,
    };
  }

  // Return response
  return response;
};

export default getLogReviewerLogs;
