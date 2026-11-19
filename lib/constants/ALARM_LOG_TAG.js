"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Log tag that marks a log as needing the team's attention. Logs (client or
 *   server) with this tag print an alert line that caccl-deploy turns into a
 *   CloudWatch alarm (notifying the team via email/Slack).
 *   Usage: logClientEvent({ ..., tags: [ALARM_LOG_TAG] })
 * @author Yuen Ler Chow
 */
var ALARM_LOG_TAG = 'Alarm';
exports.default = ALARM_LOG_TAG;
//# sourceMappingURL=ALARM_LOG_TAG.js.map