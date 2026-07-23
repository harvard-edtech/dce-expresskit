// Import dce-commonkit
import {
  abbreviate,
  avg,
  ceilToNumDecimals,
  floorToNumDecimals,
  forceNumIntoBounds,
  padDecimalZeros,
  padZerosLeft,
  roundToNumDecimals,
  sum,
  waitMs,
  getOrdinal,
  getTimeInfoInET,
  getMondayOfTimestamp,
  getTimestampFromTimeInfoInET,
  startMinWait,
  getHumanReadableDate,
  getPartOfDay,
  stringsToHumanReadableList,
  onlyKeepLetters,
  parallelLimit,
  getMonthName,
  genCSV,
  extractProp,
  compareArraysByProp,
  getLocalTimeInfo,
  genCommaList,
  prefixWithAOrAn,
  everyAsync,
  filterAsync,
  forEachAsync,
  mapAsync,
  someAsync,
  capitalize,
  shuffleArray,
  DayOfWeek,
  Log,
  LogType,
  LogSource,
  LogAction,
  LogBuiltInMetadata,
  LogMetadataType,
  LogFunction,
  MINUTE_IN_MS,
  HOUR_IN_MS,
  DAY_IN_MS,
  ErrorWithCode,
  ParamType,
  spaceAtCapitals,
} from 'dce-commonkit';

// Import helpers
import initServer from './helpers/initServer';
import genRouteHandler from './helpers/genRouteHandler';
import handleError from './helpers/handleError';
import handleSuccess from './helpers/handleSuccess';
import addDBEditorEndpoints from './helpers/addDBEditorEndpoints';
import visitEndpointOnAnotherServer from './helpers/visitEndpointOnAnotherServer';
import initExpressKitCollections, { getLogCollection } from './helpers/initExpressKitCollections';
import { genCourseContext, verifyCourseContextToken } from './helpers/courseContext';
import addCourseContextEndpoint from './helpers/addCourseContextEndpoint';

// Import constants
import COURSE_CONTEXT_HEADER from './constants/COURSE_CONTEXT_HEADER';

// Import types
import CrossServerCredential from './types/CrossServerCredential';
import VerifiedCourseAuth from './types/VerifiedCourseAuth';
import CourseContextTokenPayload from './types/CourseContextTokenPayload';

// Export each item
export {
  // Errors
  ErrorWithCode,
  // Constants
  MINUTE_IN_MS,
  HOUR_IN_MS,
  DAY_IN_MS,
  // Helpers
  abbreviate,
  avg,
  ceilToNumDecimals,
  floorToNumDecimals,
  forceNumIntoBounds,
  padDecimalZeros,
  padZerosLeft,
  roundToNumDecimals,
  sum,
  waitMs,
  getOrdinal,
  getTimeInfoInET,
  getMondayOfTimestamp,
  getTimestampFromTimeInfoInET,
  startMinWait,
  getHumanReadableDate,
  getPartOfDay,
  stringsToHumanReadableList,
  onlyKeepLetters,
  parallelLimit,
  getMonthName,
  genCSV,
  extractProp,
  compareArraysByProp,
  genCommaList,
  getLocalTimeInfo,
  prefixWithAOrAn,
  everyAsync,
  filterAsync,
  forEachAsync,
  mapAsync,
  someAsync,
  capitalize,
  shuffleArray,
  spaceAtCapitals,
  // Server helpers
  initServer,
  genRouteHandler,
  handleError,
  handleSuccess,
  initExpressKitCollections,
  getLogCollection,
  addDBEditorEndpoints,
  visitEndpointOnAnotherServer,
  // Course context (per-tab course authorization)
  genCourseContext,
  verifyCourseContextToken,
  addCourseContextEndpoint,
  COURSE_CONTEXT_HEADER,
  // Types
  DayOfWeek,
  Log,
  LogType,
  LogSource,
  LogAction,
  LogBuiltInMetadata,
  LogMetadataType,
  LogFunction,
  CrossServerCredential,
  VerifiedCourseAuth,
  CourseContextTokenPayload,
  // Server types
  ParamType,
};
