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
// Import dce-reactkit
var dce_reactkit_1 = require("dce-reactkit");
// Import shared helpers
var genRouteHandler_1 = __importDefault(require("./genRouteHandler"));
var getLogReviewerLogs_1 = __importDefault(require("./getLogReviewerLogs"));
// Import shared types
var ExpressKitErrorCode_1 = __importDefault(require("../types/ExpressKitErrorCode"));
// Import shared helpers
var initExpressKitCollections_1 = require("./initExpressKitCollections");
/*------------------------------------------------------------------------*/
/*                                  Main                                  */
/*------------------------------------------------------------------------*/
/**
 * Prepare dce-reactkit to run on the server
 * @author Gabe Abrams
 * @param opts object containing all arguments
 * @param opts.app express app from inside of the postprocessor function that
 *   we will add routes to
 */
var initServer = function (opts) {
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
     * @param {object} [overriddenUserInfo] object containing info to override
     * @param {number} [opts.userId] overriding Canvas id of the user performing the action
     * @param {string} [opts.userFirstName] overriding first name of the user performing the action
     * @param {string} [opts.userLastName] overriding last name of the user performing the action
     * @returns {Log}
     */
    opts.app.post(dce_reactkit_1.LOG_ROUTE_PATH, (0, genRouteHandler_1.default)({
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
            overriddenUserInfo: dce_reactkit_1.ParamType.JSONOptional,
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
                    userId: (params.overriddenUserInfo ? params.overriddenUserInfo.userId : undefined),
                    userFirstName: (params.overriddenUserInfo ? params.overriddenUserInfo.userFirstName : undefined),
                    userLastName: (params.overriddenUserInfo ? params.overriddenUserInfo.userLastName : undefined),
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
                    userId: (params.overriddenUserInfo ? params.overriddenUserInfo.userId : undefined),
                    userFirstName: (params.overriddenUserInfo ? params.overriddenUserInfo.userFirstName : undefined),
                    userLastName: (params.overriddenUserInfo ? params.overriddenUserInfo.userLastName : undefined),
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
        var logReviewerAdminCollection, matches, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Immediately deny access if user is not an admin
                    if (!isAdmin) {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, (0, initExpressKitCollections_1.internalGetLogReviewerAdminCollection)()];
                case 1:
                    logReviewerAdminCollection = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, logReviewerAdminCollection.find({ id: userId })];
                case 3:
                    matches = _a.sent();
                    // Make sure at least one entry matches
                    return [2 /*return*/, matches.length > 0];
                case 4:
                    err_1 = _a.sent();
                    // If an error occurred, simply return false
                    return [2 /*return*/, false];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Check if the current user has access to logs
     * @author Gabe Abrams
     * @returns {boolean} true if user has access
     */
    opts.app.get(dce_reactkit_1.LOG_REVIEW_STATUS_ROUTE, (0, genRouteHandler_1.default)({
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
                        // Return result
                        return [2 /*return*/, canReview];
                }
            });
        }); },
    }));
    /**
     * Get filtered logs based on provided filters
     * @author Gabe Abrams
     * @author Yuen Ler Chow
     * @param pageNumber the page number to get
     * @param filters the filters to apply to the logs
     * @returns {Log[]} list of logs that match the filters
     */
    opts.app.get(dce_reactkit_1.LOG_REVIEW_GET_LOGS_ROUTE, (0, genRouteHandler_1.default)({
        paramTypes: {
            pageNumber: dce_reactkit_1.ParamType.Int,
            filters: dce_reactkit_1.ParamType.JSON,
            countDocuments: dce_reactkit_1.ParamType.Boolean,
        },
        handler: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var pageNumber, userId, isAdmin, filters, countDocuments, canReview, logCollection, response;
            var params = _b.params;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        pageNumber = params.pageNumber, userId = params.userId, isAdmin = params.isAdmin, filters = params.filters, countDocuments = params.countDocuments;
                        return [4 /*yield*/, canReviewLogs(userId, isAdmin)];
                    case 1:
                        canReview = _c.sent();
                        if (!canReview) {
                            throw new dce_reactkit_1.ErrorWithCode('You cannot access this resource because you do not have the appropriate permissions.', ExpressKitErrorCode_1.default.NotAllowedToReviewLogs);
                        }
                        return [4 /*yield*/, (0, initExpressKitCollections_1.internalGetLogCollection)()];
                    case 2:
                        logCollection = _c.sent();
                        return [4 /*yield*/, (0, getLogReviewerLogs_1.default)({
                                pageNumber: pageNumber,
                                filters: filters,
                                countDocuments: countDocuments,
                                logCollection: logCollection,
                            })];
                    case 3:
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