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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import dce-commonkit
var dce_commonkit_1 = require("dce-commonkit");
// Import shared constants
var ALARM_LOG_TAG_1 = __importDefault(require("../constants/ALARM_LOG_TAG"));
// Max length of the error message to include
var MAX_MESSAGE_LENGTH = 300;
/**
 * Print a single-line JSON alert to the console if a log was tagged with
 *   ALARM_LOG_TAG. caccl-deploy alarms on any app output line with
 *   "cacclDeployAlert": true and notifies the team (email/Slack).
 *   Alerts are opt-in: untagged logs never print (server 5xx responses are
 *   already caught by caccl-deploy's 5xx alarm on the load balancer)
 * @author Yuen Ler Chow
 * @param log the log that was created
 */
var printAlertIfNeeded = function (log) {
    try {
        if (!Array.isArray(log.tags) || !log.tags.includes(ALARM_LOG_TAG_1.default)) {
            return;
        }
        // eslint-disable-next-line no-console
        console.error(JSON.stringify(__assign(__assign(__assign({ cacclDeployAlert: true, source: log.source, context: log.context, subcontext: log.subcontext }, (log.type === dce_commonkit_1.LogType.Error
            ? {
                errorCode: log.errorCode,
                errorMessage: String(log.errorMessage).substring(0, MAX_MESSAGE_LENGTH),
            }
            : {})), (log.source === dce_commonkit_1.LogSource.Server
            ? { route: log.routeTemplate }
            : {})), { logId: log.id, courseId: log.courseId, userId: log.userId })));
    }
    catch (err) {
        // Never let alerting break logging
    }
};
exports.default = printAlertIfNeeded;
//# sourceMappingURL=printAlertIfNeeded.js.map