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
// Import dce-commonkit
var dce_reactkit_1 = require("dce-commonkit");
// Import shared types
var LOG_REVIEW_PAGE_SIZE_1 = __importDefault(require("../constants/LOG_REVIEW_PAGE_SIZE"));
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
var getLogReviewerLogs = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    var pageNumber, filters, countDocuments, logCollection, _a, dateFilterState, contextFilterState, tagFilterState, actionErrorFilterState, advancedFilterState, query, startDate, endDate, startTimestamp, endTimestamp, contextConditions, selectedTags, selectedTargets, selectedActions, roles, response, numPages, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                pageNumber = opts.pageNumber, filters = opts.filters, countDocuments = opts.countDocuments, logCollection = opts.logCollection;
                _a = filters, dateFilterState = _a.dateFilterState, contextFilterState = _a.contextFilterState, tagFilterState = _a.tagFilterState, actionErrorFilterState = _a.actionErrorFilterState, advancedFilterState = _a.advancedFilterState;
                query = {};
                startDate = dateFilterState.startDate, endDate = dateFilterState.endDate;
                startTimestamp = new Date("".concat(startDate.month, "/").concat(startDate.day, "/").concat(startDate.year)).getTime();
                endTimestamp = ((new Date("".concat(endDate.month, "/").concat(endDate.day, "/").concat(endDate.year))).getTime()
                    + dce_reactkit_1.DAY_IN_MS);
                // Add a date range condition to the query
                query.timestamp = {
                    $gte: startTimestamp,
                    $lt: endTimestamp,
                };
                contextConditions = [];
                Object.keys(contextFilterState).forEach(function (context) {
                    var value = contextFilterState[context];
                    if (typeof value === 'boolean') {
                        if (value) {
                            // The entire context is selected
                            contextConditions.push({ context: context });
                        }
                    }
                    else {
                        // The context has subcontexts
                        var subcontexts = Object.keys(value).filter(function (subcontext) {
                            return value[subcontext];
                        });
                        if (subcontexts.length > 0) {
                            contextConditions.push({
                                context: context,
                                subcontext: { $in: subcontexts },
                            });
                        }
                    }
                });
                if (contextConditions.length > 0) {
                    query.$or = contextConditions;
                }
                selectedTags = Object.keys(tagFilterState).filter(function (tag) { return tagFilterState[tag]; });
                if (selectedTags.length > 0) {
                    query.tags = { $in: selectedTags };
                }
                /* --------- Action/Error Filter ---------- */
                if (actionErrorFilterState.type) {
                    query.type = actionErrorFilterState.type;
                }
                if (actionErrorFilterState.type === dce_reactkit_1.LogType.Error) {
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
                if (actionErrorFilterState.type === dce_reactkit_1.LogType.Action) {
                    selectedTargets = (Object.keys(actionErrorFilterState.target)
                        .filter(function (target) {
                        return actionErrorFilterState.target[target];
                    }));
                    selectedActions = (Object.keys(actionErrorFilterState.action)
                        .filter(function (action) {
                        return actionErrorFilterState.action[action];
                    }));
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
                roles = [];
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
                return [4 /*yield*/, logCollection.findPaged({
                        query: query,
                        perPage: LOG_REVIEW_PAGE_SIZE_1.default,
                        pageNumber: pageNumber,
                        sortDescending: true,
                    })];
            case 1:
                response = _d.sent();
                if (!countDocuments) return [3 /*break*/, 3];
                _c = (_b = Math).ceil;
                return [4 /*yield*/, logCollection.count(query)];
            case 2:
                numPages = _c.apply(_b, [(_d.sent())
                        / LOG_REVIEW_PAGE_SIZE_1.default]);
                return [2 /*return*/, __assign(__assign({}, response), { numPages: numPages })];
            case 3: 
            // Return response
            return [2 /*return*/, response];
        }
    });
}); };
exports.default = getLogReviewerLogs;
//# sourceMappingURL=getLogReviewerLogs.js.map