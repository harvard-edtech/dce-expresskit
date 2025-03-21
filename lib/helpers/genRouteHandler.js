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
// Import caccl
var server_1 = require("caccl/server");
// Import caccl functions
var initServer_1 = require("./initServer");
// Import shared types
var ExpressKitErrorCode_1 = __importDefault(require("../types/ExpressKitErrorCode"));
// Import helpers
var handleError_1 = __importDefault(require("./handleError"));
var handleSuccess_1 = __importDefault(require("./handleSuccess"));
var genErrorPage_1 = __importDefault(require("../html/genErrorPage"));
var genInfoPage_1 = __importDefault(require("../html/genInfoPage"));
var parseUserAgent_1 = __importDefault(require("./parseUserAgent"));
var dataSigner_1 = require("./dataSigner");
/**
 * Generate an express API route handler
 * @author Gabe Abrams
 * @param opts object containing all arguments
 * @param opts.paramTypes map containing the types for each parameter that is
 *   included in the request (map: param name => type)
 * @param opts.handler function that processes the request
 * @param [opts.crossServerScope] the scope associated with this endpoint.
 *   If defined, this is a cross-server endpoint, which will never
 *   have any launch data, will never check Canvas roles or launch status, and will
 *   instead use scopes and reactkit credentials to sign and validate requests.
 *   Never start the path with /api/ttm or /api/admin if the endpoint is a cross-server
 *   endpoint because those roles will not be validated
 * @param [opts.skipSessionCheck=true if crossServerScope defined] if true, skip
 *   the session check (allow users to not be logged in and launched via LTI).
 *   If crossServerScope is defined, this is always true
 * @param [opts.unhandledErrorMessagePrefix] if included, when an error that
 *   is not of type ErrorWithCode is thrown, the client will receive an error
 *   where the error message is prefixed with this string. For example,
 *   if unhandledErrorMessagePrefix is
 *   'While saving progress, we encountered an error:'
 *   and the error is 'progressInfo is not an object',
 *   the client will receive an error with the message
 *   'While saving progress, we encountered an error: progressInfo is not an object'
 * @returns express route handler that takes the following arguments:
 *   params (map: param name => value),
 *   req (express request object),
 *   next (express next function),
 *   send (a function that sends a string to the client),
 *   redirect (takes a url and redirects the user to that url),
 *   renderErrorPage (shows a static error page to the user),
 *   renderInfoPage (shows a static info page to the user),
 *   renderCustomHTML (renders custom html and sends it to the user),
 *   and returns the value to send to the client as a JSON API response, or
 *   calls next() or redirect(...) or send(...) or renderErrorPage(...).
 *   Note: params also has userId, userFirstName,
 *   userLastName, userEmail, userAvatarURL, isLearner, isTTM, isAdmin,
 *   and any other variables that
 *   are directly added to the session, if the user does have a session.
 */
var genRouteHandler = function (opts) {
    // Return a route handler
    return function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var output, crossServerScope, skipSessionCheck, requestBody, paramsToSign, err_1, paramList, i, _a, name_1, type, value, simpleVal, _b, launched, launchInfo, logServerEvent, responseSent, redirect, send, renderErrorPage, renderInfoPage, renderCustomHTML, results, err_2;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        return __generator(this, function (_v) {
            switch (_v.label) {
                case 0:
                    output = {};
                    crossServerScope = null;
                    if (opts.crossServerScope) {
                        crossServerScope = (_c = opts.crossServerScope) !== null && _c !== void 0 ? _c : null;
                    }
                    skipSessionCheck = !!(opts.skipSessionCheck
                        || crossServerScope);
                    requestBody = __assign(__assign(__assign({}, req.body), req.query), req.params);
                    if (!crossServerScope) return [3 /*break*/, 4];
                    _v.label = 1;
                case 1:
                    _v.trys.push([1, 3, , 4]);
                    paramsToSign = __assign(__assign({}, req.body), req.query);
                    // Validate the request body
                    return [4 /*yield*/, (0, dataSigner_1.validateSignedRequest)({
                            method: (_d = req.method) !== null && _d !== void 0 ? _d : 'GET',
                            path: req.path,
                            scope: crossServerScope,
                            params: paramsToSign,
                        })];
                case 2:
                    // Validate the request body
                    _v.sent();
                    // Valid! Remove oauth values because they're no longer needed, and shouldn't be passed to the handler
                    Object.keys(requestBody).forEach(function (key) {
                        if (key.startsWith('oauth_')) {
                            delete requestBody[key];
                        }
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _v.sent();
                    return [2 /*return*/, (0, handleError_1.default)(res, {
                            message: "The authenticity of a cross-server request could not be validated because an error occurred: ".concat((_e = err_1.message) !== null && _e !== void 0 ? _e : 'unknown error'),
                            code: ((_f = err_1.code) !== null && _f !== void 0 ? _f : ExpressKitErrorCode_1.default.UnknownCrossServerError),
                            status: 401,
                        })];
                case 4:
                    paramList = Object.entries((_g = opts.paramTypes) !== null && _g !== void 0 ? _g : {});
                    for (i = 0; i < paramList.length; i++) {
                        _a = paramList[i], name_1 = _a[0], type = _a[1];
                        value = requestBody[name_1];
                        // Parse
                        if (type === dce_reactkit_1.ParamType.Boolean || type === dce_reactkit_1.ParamType.BooleanOptional) {
                            // Boolean
                            // Handle case where value doesn't exist
                            if (value === undefined) {
                                if (type === dce_reactkit_1.ParamType.BooleanOptional) {
                                    output[name_1] = undefined;
                                }
                                else {
                                    return [2 /*return*/, (0, handleError_1.default)(res, {
                                            message: "Parameter ".concat(name_1, " is required, but it was not included."),
                                            code: ExpressKitErrorCode_1.default.MissingParameter,
                                            status: 422,
                                        })];
                                }
                            }
                            else {
                                simpleVal = (String(value)
                                    .trim()
                                    .toLowerCase());
                                // Parse
                                output[name_1] = ([
                                    'true',
                                    'yes',
                                    'y',
                                    '1',
                                    't',
                                ].indexOf(simpleVal) >= 0);
                            }
                        }
                        else if (type === dce_reactkit_1.ParamType.Float || type === dce_reactkit_1.ParamType.FloatOptional) {
                            // Float
                            // Handle case where value doesn't exist
                            if (value === undefined) {
                                if (type === dce_reactkit_1.ParamType.FloatOptional) {
                                    output[name_1] = undefined;
                                }
                                else {
                                    return [2 /*return*/, (0, handleError_1.default)(res, {
                                            message: "Parameter ".concat(name_1, " is required, but it was not included."),
                                            code: ExpressKitErrorCode_1.default.MissingParameter,
                                            status: 422,
                                        })];
                                }
                            }
                            else if (!Number.isNaN(Number.parseFloat(String(value)))) {
                                // Value is a number
                                output[name_1] = Number.parseFloat(String(value));
                            }
                            else {
                                // Issue!
                                return [2 /*return*/, (0, handleError_1.default)(res, {
                                        message: "Request data was malformed: ".concat(name_1, " was not a valid float."),
                                        code: ExpressKitErrorCode_1.default.InvalidParameter,
                                        status: 422,
                                    })];
                            }
                        }
                        else if (type === dce_reactkit_1.ParamType.Int || type === dce_reactkit_1.ParamType.IntOptional) {
                            // Int
                            // Handle case where value doesn't exist
                            if (value === undefined) {
                                if (type === dce_reactkit_1.ParamType.IntOptional) {
                                    output[name_1] = undefined;
                                }
                                else {
                                    return [2 /*return*/, (0, handleError_1.default)(res, {
                                            message: "Parameter ".concat(name_1, " is required, but it was not included."),
                                            code: ExpressKitErrorCode_1.default.MissingParameter,
                                            status: 422,
                                        })];
                                }
                            }
                            else if (!Number.isNaN(Number.parseInt(String(value), 10))) {
                                // Value is a number
                                output[name_1] = Number.parseInt(String(value), 10);
                            }
                            else {
                                // Issue!
                                return [2 /*return*/, (0, handleError_1.default)(res, {
                                        message: "Request data was malformed: ".concat(name_1, " was not a valid int."),
                                        code: ExpressKitErrorCode_1.default.InvalidParameter,
                                        status: 422,
                                    })];
                            }
                        }
                        else if (type === dce_reactkit_1.ParamType.JSON || type === dce_reactkit_1.ParamType.JSONOptional) {
                            // Stringified JSON
                            // Handle case where value doesn't exist
                            if (value === undefined) {
                                if (type === dce_reactkit_1.ParamType.JSONOptional) {
                                    output[name_1] = undefined;
                                }
                                else {
                                    return [2 /*return*/, (0, handleError_1.default)(res, {
                                            message: "Parameter ".concat(name_1, " is required, but it was not included."),
                                            code: ExpressKitErrorCode_1.default.MissingParameter,
                                            status: 422,
                                        })];
                                }
                            }
                            else {
                                // Value exists
                                // Parse
                                try {
                                    output[name_1] = JSON.parse(String(value));
                                }
                                catch (err) {
                                    return [2 /*return*/, (0, handleError_1.default)(res, {
                                            message: "Request data was malformed: ".concat(name_1, " was not a valid JSON payload."),
                                            code: ExpressKitErrorCode_1.default.InvalidParameter,
                                            status: 422,
                                        })];
                                }
                            }
                        }
                        else if (type === dce_reactkit_1.ParamType.String || type === dce_reactkit_1.ParamType.StringOptional) {
                            // String
                            // Handle case where value doesn't exist
                            if (value === undefined) {
                                if (type === dce_reactkit_1.ParamType.StringOptional) {
                                    output[name_1] = undefined;
                                }
                                else {
                                    return [2 /*return*/, (0, handleError_1.default)(res, {
                                            message: "Parameter ".concat(name_1, " is required, but it was not included."),
                                            code: ExpressKitErrorCode_1.default.MissingParameter,
                                            status: 422,
                                        })];
                                }
                            }
                            else {
                                // Value exists
                                // Leave as is
                                output[name_1] = value;
                            }
                        }
                        else {
                            // No valid data type
                            return [2 /*return*/, (0, handleError_1.default)(res, {
                                    message: "An internal error occurred: we could not determine the type of ".concat(name_1, "."),
                                    code: ExpressKitErrorCode_1.default.InvalidParameter,
                                    status: 422,
                                })];
                        }
                    }
                    _b = (0, server_1.getLaunchInfo)(req), launched = _b.launched, launchInfo = _b.launchInfo;
                    if (
                    // Not launched
                    (!launched || !launchInfo)
                        // Not skipping the session check
                        && !skipSessionCheck) {
                        return [2 /*return*/, (0, handleError_1.default)(res, {
                                message: 'Your session has expired. Please refresh the page and try again.',
                                code: dce_reactkit_1.ReactKitErrorCode.SessionExpired,
                                status: 401,
                            })];
                    }
                    // Error if user info cannot be found
                    if (
                    // User information is incomplete
                    (!launchInfo
                        || !launchInfo.userId
                        || !launchInfo.userFirstName
                        || !launchInfo.userLastName
                        || (launchInfo.notInCourse
                            && !launchInfo.isAdmin)
                        || (!launchInfo.isTTM
                            && !launchInfo.isLearner
                            && !launchInfo.isAdmin))
                        // Not skipping the session check
                        && !skipSessionCheck) {
                        return [2 /*return*/, (0, handleError_1.default)(res, {
                                message: 'Your session was invalid. Please refresh the page and try again.',
                                code: dce_reactkit_1.ReactKitErrorCode.SessionExpired,
                                status: 401,
                            })];
                    }
                    // Add launch info to output
                    output.userId = (launchInfo
                        ? launchInfo.userId
                        : ((_h = output.userId) !== null && _h !== void 0 ? _h : undefined));
                    output.userFirstName = (launchInfo
                        ? launchInfo.userFirstName
                        : ((_j = output.userFirstName) !== null && _j !== void 0 ? _j : undefined));
                    output.userLastName = (launchInfo
                        ? launchInfo.userLastName
                        : ((_k = output.userLastName) !== null && _k !== void 0 ? _k : undefined));
                    output.userEmail = (launchInfo
                        ? launchInfo.userEmail
                        : ((_l = output.userEmail) !== null && _l !== void 0 ? _l : undefined));
                    output.userAvatarURL = (launchInfo
                        ? ((_m = launchInfo.userImage) !== null && _m !== void 0 ? _m : 'http://www.gravatar.com/avatar/?d=identicon')
                        : ((_o = output.userAvatarURL) !== null && _o !== void 0 ? _o : undefined));
                    output.isLearner = (launchInfo
                        ? !!launchInfo.isLearner
                        : ((_p = output.isLearner) !== null && _p !== void 0 ? _p : undefined));
                    output.isTTM = (launchInfo
                        ? !!launchInfo.isTTM
                        : ((_q = output.isTTM) !== null && _q !== void 0 ? _q : undefined));
                    output.isAdmin = (launchInfo
                        ? !!launchInfo.isAdmin
                        : ((_r = output.isAdmin) !== null && _r !== void 0 ? _r : undefined));
                    output.courseId = (launchInfo
                        ? ((_s = output.courseId) !== null && _s !== void 0 ? _s : launchInfo.courseId)
                        : ((_t = output.courseId) !== null && _t !== void 0 ? _t : undefined));
                    output.courseName = (launchInfo
                        ? launchInfo.contextLabel
                        : ((_u = output.courseName) !== null && _u !== void 0 ? _u : undefined));
                    // Add other session variables
                    Object.keys(req.session).forEach(function (propName) {
                        // Skip if prop already in output
                        if (output[propName] !== undefined) {
                            return;
                        }
                        // Add to output
                        var value = req.session[propName];
                        if (typeof value === 'string'
                            || typeof value === 'boolean'
                            || typeof value === 'number') {
                            output[propName] = value;
                        }
                    });
                    /*----------------------------------------*/
                    /* ----- Require Course Consistency ----- */
                    /*----------------------------------------*/
                    // Make sure the user actually launched from the appropriate course
                    if (output.courseId
                        && launchInfo
                        && launchInfo.courseId
                        && output.courseId !== launchInfo.courseId
                        && !output.isTTM
                        && !output.isAdmin) {
                        // Course of interest is not the launch course
                        return [2 /*return*/, (0, handleError_1.default)(res, {
                                message: 'You switched sessions by opening this app in another tab. Please refresh the page and try again.',
                                code: ExpressKitErrorCode_1.default.WrongCourse,
                                status: 401,
                            })];
                    }
                    /*----------------------------------------*/
                    /*       Require Proper Permissions       */
                    /*----------------------------------------*/
                    // Add TTM endpoint security
                    if (
                    // This is a TTM endpoint
                    req.path.startsWith('/api/ttm')
                        // User is not a TTM
                        && (
                        // User is not a TTM
                        !output.isTTM
                            // User is not an admin
                            && !output.isAdmin)) {
                        // User does not have access
                        return [2 /*return*/, (0, handleError_1.default)(res, {
                                message: 'This action is only allowed if you are a teaching team member for the course. Please go back to Canvas, log in as a teaching team member, and try again.',
                                code: ExpressKitErrorCode_1.default.NotTTM,
                                status: 401,
                            })];
                    }
                    // Add Admin endpoint security
                    if (
                    // This is an admin endpoint
                    req.path.startsWith('/api/admin')
                        // User is not an admin
                        && !output.isAdmin) {
                        // User does not have access
                        return [2 /*return*/, (0, handleError_1.default)(res, {
                                message: 'This action is only allowed if you are a Canvas admin. Please go back to Canvas, log in as an admin, and try again.',
                                code: ExpressKitErrorCode_1.default.NotAdmin,
                                status: 401,
                            })];
                    }
                    logServerEvent = function (logOpts) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, browser, device, _b, timestamp, year, month, day, hour, minute, mainLogInfo, typeSpecificInfo, sourceSpecificInfo, log, logCollection, err_3, dummyMainInfo, dummyTypeSpecificInfo, dummySourceSpecificInfo, log;
                        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                        return __generator(this, function (_r) {
                            switch (_r.label) {
                                case 0:
                                    _r.trys.push([0, 4, , 5]);
                                    _a = (0, parseUserAgent_1.default)(req.headers['user-agent']), browser = _a.browser, device = _a.device;
                                    _b = (0, dce_reactkit_1.getTimeInfoInET)(), timestamp = _b.timestamp, year = _b.year, month = _b.month, day = _b.day, hour = _b.hour, minute = _b.minute;
                                    mainLogInfo = {
                                        id: "".concat(launchInfo ? launchInfo.userId : 'unknown', "-").concat(Date.now(), "-").concat(Math.floor(Math.random() * 100000), "-").concat(Math.floor(Math.random() * 100000)),
                                        userFirstName: (launchInfo ? launchInfo.userFirstName : 'unknown'),
                                        userLastName: (launchInfo ? launchInfo.userLastName : 'unknown'),
                                        userEmail: (launchInfo ? launchInfo.userEmail : 'unknown'),
                                        userId: (launchInfo ? launchInfo.userId : -1),
                                        isLearner: (launchInfo && !!launchInfo.isLearner),
                                        isAdmin: (launchInfo && !!launchInfo.isAdmin),
                                        isTTM: (launchInfo && !!launchInfo.isTTM),
                                        courseId: (launchInfo ? launchInfo.courseId : -1),
                                        courseName: (launchInfo ? launchInfo.contextLabel : 'unknown'),
                                        browser: browser,
                                        device: device,
                                        year: year,
                                        month: month,
                                        day: day,
                                        hour: hour,
                                        minute: minute,
                                        timestamp: timestamp,
                                        context: (typeof logOpts.context === 'string'
                                            ? logOpts.context
                                            : ((_d = ((_c = logOpts.context) !== null && _c !== void 0 ? _c : {})._) !== null && _d !== void 0 ? _d : dce_reactkit_1.LogBuiltInMetadata.Context.Uncategorized)),
                                        subcontext: ((_e = logOpts.subcontext) !== null && _e !== void 0 ? _e : dce_reactkit_1.LogBuiltInMetadata.Context.Uncategorized),
                                        tags: ((_f = logOpts.tags) !== null && _f !== void 0 ? _f : []),
                                        level: ((_g = logOpts.level) !== null && _g !== void 0 ? _g : dce_reactkit_1.LogLevel.Info),
                                        metadata: ((_h = logOpts.metadata) !== null && _h !== void 0 ? _h : {}),
                                    };
                                    typeSpecificInfo = (('error' in opts && opts.error)
                                        ? {
                                            type: dce_reactkit_1.LogType.Error,
                                            errorMessage: (_j = logOpts.error.message) !== null && _j !== void 0 ? _j : 'Unknown message',
                                            errorCode: (_k = logOpts.error.code) !== null && _k !== void 0 ? _k : dce_reactkit_1.ReactKitErrorCode.NoCode,
                                            errorStack: (_l = logOpts.error.stack) !== null && _l !== void 0 ? _l : 'No stack',
                                        }
                                        : {
                                            type: dce_reactkit_1.LogType.Action,
                                            target: ((_m = logOpts.target) !== null && _m !== void 0 ? _m : dce_reactkit_1.LogBuiltInMetadata.Target.NoTarget),
                                            action: ((_o = logOpts.action) !== null && _o !== void 0 ? _o : dce_reactkit_1.LogAction.Unknown),
                                        });
                                    sourceSpecificInfo = (logOpts.overrideAsClientEvent
                                        ? {
                                            source: dce_reactkit_1.LogSource.Client,
                                        }
                                        : {
                                            source: dce_reactkit_1.LogSource.Server,
                                            routePath: req.path,
                                            routeTemplate: req.route.path,
                                        });
                                    log = __assign(__assign(__assign({}, mainLogInfo), typeSpecificInfo), sourceSpecificInfo);
                                    logCollection = (0, initServer_1.internalGetLogCollection)();
                                    if (!logCollection) return [3 /*break*/, 2];
                                    // Store to the log collection
                                    return [4 /*yield*/, logCollection.insert(log)];
                                case 1:
                                    // Store to the log collection
                                    _r.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    if (log.type === dce_reactkit_1.LogType.Error) {
                                        // Print to console
                                        // eslint-disable-next-line no-console
                                        console.error('dce-reactkit error log:', log);
                                    }
                                    else {
                                        // eslint-disable-next-line no-console
                                        console.log('dce-reactkit action log:', log);
                                    }
                                    _r.label = 3;
                                case 3: 
                                // Return log entry
                                return [2 /*return*/, log];
                                case 4:
                                    err_3 = _r.sent();
                                    // Print because we cannot store the error
                                    // eslint-disable-next-line no-console
                                    console.error('Could not log the following:', logOpts, 'due to this error:', ((_p = err_3) !== null && _p !== void 0 ? _p : {}).message, ((_q = err_3) !== null && _q !== void 0 ? _q : {}).stack);
                                    dummyMainInfo = {
                                        id: '-1',
                                        userFirstName: 'Unknown',
                                        userLastName: 'Unknown',
                                        userEmail: 'unknown@harvard.edu',
                                        userId: 1,
                                        isLearner: false,
                                        isAdmin: false,
                                        isTTM: false,
                                        courseId: 1,
                                        courseName: 'Unknown',
                                        browser: {
                                            name: 'Unknown',
                                            version: 'Unknown',
                                        },
                                        device: {
                                            isMobile: false,
                                            os: 'Unknown',
                                        },
                                        year: 1,
                                        month: 1,
                                        day: 1,
                                        hour: 1,
                                        minute: 1,
                                        timestamp: Date.now(),
                                        tags: [],
                                        level: dce_reactkit_1.LogLevel.Warn,
                                        metadata: {},
                                        context: dce_reactkit_1.LogBuiltInMetadata.Context.Uncategorized,
                                        subcontext: dce_reactkit_1.LogBuiltInMetadata.Context.Uncategorized,
                                    };
                                    dummyTypeSpecificInfo = {
                                        type: dce_reactkit_1.LogType.Error,
                                        errorMessage: 'Unknown',
                                        errorCode: 'Unknown',
                                        errorStack: 'No Stack',
                                    };
                                    dummySourceSpecificInfo = {
                                        source: dce_reactkit_1.LogSource.Server,
                                        routePath: req.path,
                                        routeTemplate: req.route.path,
                                    };
                                    log = __assign(__assign(__assign({}, dummyMainInfo), dummyTypeSpecificInfo), dummySourceSpecificInfo);
                                    return [2 /*return*/, log];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); };
                    responseSent = false;
                    redirect = function (pathOrURL) {
                        responseSent = true;
                        res.redirect(pathOrURL);
                    };
                    send = function (text, status) {
                        if (status === void 0) { status = 200; }
                        responseSent = true;
                        res.status(status).send(text);
                    };
                    renderErrorPage = function (renderOpts) {
                        var _a, _b, _c;
                        if (renderOpts === void 0) { renderOpts = {}; }
                        var html = (0, genErrorPage_1.default)(renderOpts);
                        send(html, (_a = renderOpts.status) !== null && _a !== void 0 ? _a : 500);
                        // Log server-side error if not a session expired error or 404
                        if (renderOpts.status && renderOpts.status === 404) {
                            return;
                        }
                        if ((_b = renderOpts.title) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes('session expired')) {
                            return;
                        }
                        logServerEvent({
                            context: dce_reactkit_1.LogBuiltInMetadata.Context.ServerRenderedErrorPage,
                            error: {
                                message: "".concat(renderOpts.title, ": ").concat(renderOpts.description),
                                code: renderOpts.code,
                            },
                            metadata: {
                                title: renderOpts.title,
                                description: renderOpts.description,
                                code: renderOpts.code,
                                pageTitle: renderOpts.pageTitle,
                                status: (_c = renderOpts.status) !== null && _c !== void 0 ? _c : 500,
                            },
                        });
                    };
                    renderInfoPage = function (renderOpts) {
                        var html = (0, genInfoPage_1.default)(renderOpts);
                        send(html, 200);
                    };
                    renderCustomHTML = function (htmlOpts) {
                        var _a;
                        send(htmlOpts.html, (_a = htmlOpts.status) !== null && _a !== void 0 ? _a : 200);
                    };
                    _v.label = 5;
                case 5:
                    _v.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, opts.handler({
                            params: output,
                            req: req,
                            send: send,
                            next: function () {
                                responseSent = true;
                                next();
                            },
                            redirect: redirect,
                            renderErrorPage: renderErrorPage,
                            renderInfoPage: renderInfoPage,
                            renderCustomHTML: renderCustomHTML,
                            logServerEvent: logServerEvent,
                        })];
                case 6:
                    results = _v.sent();
                    // Send results to client (only if next wasn't called)
                    if (!responseSent) {
                        return [2 /*return*/, (0, handleSuccess_1.default)(res, results !== null && results !== void 0 ? results : undefined)];
                    }
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _v.sent();
                    // Prefix error message if needed
                    if (opts.unhandledErrorMessagePrefix
                        && err_2 instanceof Error
                        && err_2.message
                        && err_2.name !== 'ErrorWithCode') {
                        err_2.message = "".concat(opts.unhandledErrorMessagePrefix.trim(), " ").concat(err_2.message.trim());
                    }
                    // Send error to client (only if next wasn't called)
                    if (!responseSent) {
                        (0, handleError_1.default)(res, err_2);
                        // Log server-side error
                        logServerEvent({
                            context: dce_reactkit_1.LogBuiltInMetadata.Context.ServerEndpointError,
                            error: err_2,
                        });
                        return [2 /*return*/];
                    }
                    // Log error that was not responded with
                    // eslint-disable-next-line no-console
                    console.log('Error occurred but could not be sent to client because a response was already sent:', err_2);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
};
exports.default = genRouteHandler;
//# sourceMappingURL=genRouteHandler.js.map