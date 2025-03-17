"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalGetCrossServerCredentialCollection = exports.internalGetLogCollection = void 0;
// Import dce-reactkit
var dce_reactkit_1 = require("dce-reactkit");
// Import internal constants of dce-reactkit
var LOG_REVIEW_ROUTE_PATH_PREFIX_1 = __importDefault(require("dce-reactkit/src/constants/LOG_REVIEW_ROUTE_PATH_PREFIX"));
var LOG_ROUTE_PATH_1 = __importDefault(require("dce-reactkit/src/constants/LOG_ROUTE_PATH"));
var LOG_REVIEW_STATUS_ROUTE_1 = __importDefault(require("dce-reactkit/src/constants/LOG_REVIEW_STATUS_ROUTE"));
// Import shared helpers
var genRouteHandler_1 = __importDefault(require("./genRouteHandler"));
// Import shared types
var ExpressKitErrorCode_1 = __importDefault(require("../types/ExpressKitErrorCode"));
// Stored copy of dce-mango log collection
var _logCollection;
// Stored copy of dce-mango cross-server credential collection
var _crossServerCredentialCollection;
/*------------------------------------------------------------------------*/
/*                                 Helpers                                */
/*------------------------------------------------------------------------*/
/**
 * Get log collection
 * @author Gabe Abrams
 * @returns log collection if one was included during launch or null if we don't
 *   have a log collection (yet)
 */
var internalGetLogCollection = function () {
    return _logCollection !== null && _logCollection !== void 0 ? _logCollection : null;
};
exports.internalGetLogCollection = internalGetLogCollection;
/**
 * Get cross-server credential collection
 * @author Gabe Abrams
 * @return cross-server credential collection if one was included during launch or null
 *   if we don't have a cross-server credential collection (yet)
 */
var internalGetCrossServerCredentialCollection = function () {
    return _crossServerCredentialCollection !== null && _crossServerCredentialCollection !== void 0 ? _crossServerCredentialCollection : null;
};
exports.internalGetCrossServerCredentialCollection = internalGetCrossServerCredentialCollection;
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
var initServer = function (opts) {
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
    opts.app.post(LOG_ROUTE_PATH_1.default, (0, genRouteHandler_1.default)({
        paramTypes: {
            context: dce_reactkit_1.ParamType.String,
            subcontext: dce_reactkit_1.ParamType.String,
            tags: dce_reactkit_1.ParamType.JSON,
            level: dce_reactkit_1.ParamType.String,
            metadata: dce_reactkit_1.ParamType.JSON,
            errorMessage: dce_reactkit_1.ParamType.StringOptional,
            errorCode: dce_reactkit_1.ParamType.StringOptional,
            errorStack: dce_reactkit_1.ParamType.StringOptional,
            target: dce_reactkit_1.ParamType.StringOptional,
            action: dce_reactkit_1.ParamType.StringOptional,
        },
        handler: function (_a) {
            var params = _a.params, logServerEvent = _a.logServerEvent;
            // Create log info
            var logInfo = ((params.errorMessage || params.errorCode || params.errorStack)
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
                });
            // Add hidden boolean to change source to "client"
            var logInfoForcedFromClient = __assign(__assign({}, logInfo), { overrideAsClientEvent: true });
            // Write the log
            var log = logServerEvent(logInfoForcedFromClient);
            // Return
            return log;
        },
    }));
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
    var canReviewLogs = function (userId, isAdmin) { return __awaiter(void 0, void 0, void 0, function () {
        var matches, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Immediately deny access if user is not an admin
                    if (!isAdmin) {
                        return [2 /*return*/, false];
                    }
                    // If all admins are allowed, we're done
                    if (!opts.logReviewAdmins) {
                        return [2 /*return*/, true];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // Array of userIds
                    if (Array.isArray(opts.logReviewAdmins)) {
                        return [2 /*return*/, opts.logReviewAdmins.some(function (allowedId) {
                                return (userId === allowedId);
                            })];
                    }
                    return [4 /*yield*/, opts.logReviewAdmins.find({ userId: userId })];
                case 2:
                    matches = _a.sent();
                    // Make sure at least one entry matches
                    return [2 /*return*/, matches.length > 0];
                case 3:
                    err_1 = _a.sent();
                    // If an error occurred, simply return false
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Check if the current user has access to logs
     * @author Gabe Abrams
     * @returns {boolean} true if user has access
     */
    opts.app.get(LOG_REVIEW_STATUS_ROUTE_1.default, (0, genRouteHandler_1.default)({
        handler: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var userId, isAdmin, canReview;
            var params = _b.params;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        userId = params.userId, isAdmin = params.isAdmin;
                        return [4 /*yield*/, canReviewLogs(userId, isAdmin)];
                    case 1:
                        canReview = _c.sent();
                        return [2 /*return*/, canReview];
                }
            });
        }); },
    }));
    /**
     * Get all logs for a certain month
     * @author Gabe Abrams
     * @param {number} year the year to query (e.g. 2022)
     * @param {number} month the month to query (e.g. 1 = January)
     * @returns {Log[]} list of logs from the given month
     */
    opts.app.get("".concat(LOG_REVIEW_ROUTE_PATH_PREFIX_1.default, "/years/:year/months/:month"), (0, genRouteHandler_1.default)({
        paramTypes: {
            year: dce_reactkit_1.ParamType.Int,
            month: dce_reactkit_1.ParamType.Int,
            pageNumber: dce_reactkit_1.ParamType.Int,
        },
        handler: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var year, month, pageNumber, userId, isAdmin, canReview, response;
            var params = _b.params;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        year = params.year, month = params.month, pageNumber = params.pageNumber, userId = params.userId, isAdmin = params.isAdmin;
                        return [4 /*yield*/, canReviewLogs(userId, isAdmin)];
                    case 1:
                        canReview = _c.sent();
                        if (!canReview) {
                            throw new dce_reactkit_1.ErrorWithCode('You cannot access this resource because you do not have the appropriate permissions.', ExpressKitErrorCode_1.default.NotAllowedToReviewLogs);
                        }
                        return [4 /*yield*/, _logCollection.findPaged({
                                query: {
                                    year: year,
                                    month: month,
                                },
                                perPage: 1000,
                                pageNumber: pageNumber,
                            })];
                    case 2:
                        response = _c.sent();
                        // Return response
                        return [2 /*return*/, response];
                }
            });
        }); },
    }));
};
exports.default = initServer;
//# sourceMappingURL=initServer.js.map