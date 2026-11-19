"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrorLog = exports.initErrorNotifier = exports.notifyByDefault = void 0;
// Import dce-commonkit
var dce_commonkit_1 = require("dce-commonkit");
/*------------------------------------------------------------------------*/
/*                                  State                                 */
/*------------------------------------------------------------------------*/
// Default throttle window
var DEFAULT_THROTTLE_MINS = 10;
// Notifier options (undefined if the app did not ask to be notified)
var notifierOpts;
// Throttle state (map: throttle key => info)
var throttleState = {};
/*------------------------------------------------------------------------*/
/*                                 Helpers                                */
/*------------------------------------------------------------------------*/
/**
 * Determine if an error should notify when the app doesn't decide.
 *   Server errors notify unless the user was sent a 4xx (the user's request
 *   was the problem). Client errors only notify if they were fatal (the user
 *   saw a fatal error screen).
 * @author Yuen Ler Chow
 * @param log the log to check
 * @param [httpStatus] the http status that was sent to the user
 * @returns true if the error should notify
 */
var notifyByDefault = function (log, httpStatus) {
    // Only errors notify
    if (log.type !== dce_commonkit_1.LogType.Error) {
        return false;
    }
    // Errors caused by the user's request don't notify
    if (httpStatus !== undefined && httpStatus < 500) {
        return false;
    }
    // Client errors only notify if they blocked the user
    if (log.source === dce_commonkit_1.LogSource.Client) {
        return (log.context === dce_commonkit_1.LogBuiltInMetadata.Context.ClientFatalError);
    }
    // Server error
    return true;
};
exports.notifyByDefault = notifyByDefault;
/**
 * Get the key used to group errors for throttling
 * @author Yuen Ler Chow
 * @param log the error log
 * @returns throttle key
 */
var getThrottleKey = function (log) {
    return [
        log.source,
        log.context,
        (log.type === dce_commonkit_1.LogType.Error ? log.errorCode : ''),
        (log.source === dce_commonkit_1.LogSource.Server ? log.routeTemplate : ''),
    ].join('|');
};
/*------------------------------------------------------------------------*/
/*                                  Main                                  */
/*------------------------------------------------------------------------*/
/**
 * Set up error notifications (called by initServer)
 * @author Yuen Ler Chow
 * @param [opts] notifier options. If excluded, no notifications are sent
 */
var initErrorNotifier = function (opts) {
    notifierOpts = opts;
};
exports.initErrorNotifier = initErrorNotifier;
/**
 * Notify the app about an error log if needed. Never throws and never
 *   waits for the notification to be sent.
 * @author Yuen Ler Chow
 * @param log the log that was created
 * @param [httpStatus] the http status that was sent to the user
 */
var handleErrorLog = function (log, httpStatus) {
    var _a;
    try {
        // Skip if the app doesn't want notifications
        if (!notifierOpts || log.type !== dce_commonkit_1.LogType.Error) {
            return;
        }
        var opts_1 = notifierOpts;
        // Decide whether to notify
        var defaultDecision = (0, exports.notifyByDefault)(log, httpStatus);
        var shouldNotify = (opts_1.shouldNotify
            ? opts_1.shouldNotify({
                log: log,
                httpStatus: httpStatus,
                notifyByDefault: defaultDecision,
            })
            : defaultDecision);
        if (!shouldNotify) {
            return;
        }
        // Throttle repeats of the same error
        var key = getThrottleKey(log);
        var throttleMs = ((_a = opts_1.throttleMins) !== null && _a !== void 0 ? _a : DEFAULT_THROTTLE_MINS) * 60 * 1000;
        var now = Date.now();
        var prev = throttleState[key];
        if (prev && now - prev.lastNotifiedAt < throttleMs) {
            prev.numSuppressed += 1;
            return;
        }
        var numSuppressed_1 = (prev ? prev.numSuppressed : 0);
        throttleState[key] = {
            lastNotifiedAt: now,
            numSuppressed: 0,
        };
        // Send without waiting
        Promise.resolve()
            .then(function () {
            return opts_1.notify({
                log: log,
                httpStatus: httpStatus,
                numSuppressed: numSuppressed_1,
            });
        })
            .catch(function (err) {
            // eslint-disable-next-line no-console
            console.error('dce-expresskit could not send an error notification:', err);
        });
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.error('dce-expresskit could not process an error notification:', err);
    }
};
exports.handleErrorLog = handleErrorLog;
//# sourceMappingURL=errorNotifier.js.map