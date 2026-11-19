"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import dce-commonkit
var dce_commonkit_1 = require("dce-commonkit");
// Max length of the error message to include
var MAX_MESSAGE_LENGTH = 300;
/**
 * Print a single-line JSON alert to the console if a log needs the team's
 *   attention. caccl-deploy alarms on any app output line with
 *   "cacclDeployAlert": true and notifies the team (email/Slack).
 *   Only client fatal errors are printed: server failures are already caught
 *   by caccl-deploy's 5xx alarm on the load balancer.
 * @author Yuen Ler Chow
 * @param log the log that was created
 */
var printAlertIfNeeded = function (log) {
    try {
        if (log.type !== dce_commonkit_1.LogType.Error
            || log.source !== dce_commonkit_1.LogSource.Client
            || log.context !== dce_commonkit_1.LogBuiltInMetadata.Context.ClientFatalError) {
            return;
        }
        // eslint-disable-next-line no-console
        console.error(JSON.stringify({
            cacclDeployAlert: true,
            reason: 'ClientFatalError',
            errorCode: log.errorCode,
            errorMessage: String(log.errorMessage).substring(0, MAX_MESSAGE_LENGTH),
            logId: log.id,
            courseId: log.courseId,
            userId: log.userId,
        }));
    }
    catch (err) {
        // Never let alerting break logging
    }
};
exports.default = printAlertIfNeeded;
//# sourceMappingURL=printAlertIfNeeded.js.map