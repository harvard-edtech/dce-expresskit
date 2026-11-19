// Import dce-commonkit
import {
  Log,
  LogType,
  LogSource,
  LogBuiltInMetadata,
} from 'dce-commonkit';

/*------------------------------------------------------------------------*/
/*                                  Types                                 */
/*------------------------------------------------------------------------*/

/**
 * Info about an error that the app should be notified about
 * @author Yuen Ler Chow
 */
export type ErrorNotification = {
  // The error log
  log: Log,
  // The http status that was sent to the user (only defined if the error
  // ended a request)
  httpStatus?: number,
  // Number of errors with the same key that were throttled since the last
  // notification for that key
  numSuppressed: number,
};

/**
 * Options for notifying the app when errors occur
 * @author Yuen Ler Chow
 */
export type ErrorNotifierOpts = {
  // Function that sends the notification (Slack, email, etc.)
  notify: (notification: ErrorNotification) => (void | Promise<void>),
  // Decide whether an error should notify. If excluded, notifyByDefault is used
  shouldNotify?: (opts: {
    // The error log
    log: Log,
    // The http status that was sent to the user (if the error ended a request)
    httpStatus?: number,
    // True if the error would notify if shouldNotify was not included
    notifyByDefault: boolean,
  }) => boolean,
  // Errors with the same source, context, code, and route are only notified
  // once per this many minutes
  throttleMins?: number,
};

/*------------------------------------------------------------------------*/
/*                                  State                                 */
/*------------------------------------------------------------------------*/

// Default throttle window
const DEFAULT_THROTTLE_MINS = 10;

// Notifier options (undefined if the app did not ask to be notified)
let notifierOpts: ErrorNotifierOpts | undefined;

// Throttle state (map: throttle key => info)
const throttleState: {
  [key: string]: {
    // Time of the last notification for this key
    lastNotifiedAt: number,
    // Number of errors throttled since the last notification
    numSuppressed: number,
  },
} = {};

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
export const notifyByDefault = (log: Log, httpStatus?: number): boolean => {
  // Only errors notify
  if (log.type !== LogType.Error) {
    return false;
  }

  // Errors caused by the user's request don't notify
  if (httpStatus !== undefined && httpStatus < 500) {
    return false;
  }

  // Client errors only notify if they blocked the user
  if (log.source === LogSource.Client) {
    return (log.context === LogBuiltInMetadata.Context.ClientFatalError);
  }

  // Server error
  return true;
};

/**
 * Get the key used to group errors for throttling
 * @author Yuen Ler Chow
 * @param log the error log
 * @returns throttle key
 */
const getThrottleKey = (log: Log): string => {
  return [
    log.source,
    log.context,
    (log.type === LogType.Error ? log.errorCode : ''),
    (log.source === LogSource.Server ? log.routeTemplate : ''),
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
export const initErrorNotifier = (opts?: ErrorNotifierOpts) => {
  notifierOpts = opts;
};

/**
 * Notify the app about an error log if needed. Never throws and never
 *   waits for the notification to be sent.
 * @author Yuen Ler Chow
 * @param log the log that was created
 * @param [httpStatus] the http status that was sent to the user
 */
export const handleErrorLog = (log: Log, httpStatus?: number) => {
  try {
    // Skip if the app doesn't want notifications
    if (!notifierOpts || log.type !== LogType.Error) {
      return;
    }
    const opts = notifierOpts;

    // Decide whether to notify
    const defaultDecision = notifyByDefault(log, httpStatus);
    const shouldNotify = (
      opts.shouldNotify
        ? opts.shouldNotify({
          log,
          httpStatus,
          notifyByDefault: defaultDecision,
        })
        : defaultDecision
    );
    if (!shouldNotify) {
      return;
    }

    // Throttle repeats of the same error
    const key = getThrottleKey(log);
    const throttleMs = (opts.throttleMins ?? DEFAULT_THROTTLE_MINS) * 60 * 1000;
    const now = Date.now();
    const prev = throttleState[key];
    if (prev && now - prev.lastNotifiedAt < throttleMs) {
      prev.numSuppressed += 1;
      return;
    }
    const numSuppressed = (prev ? prev.numSuppressed : 0);
    throttleState[key] = {
      lastNotifiedAt: now,
      numSuppressed: 0,
    };

    // Send without waiting
    Promise.resolve()
      .then(() => {
        return opts.notify({
          log,
          httpStatus,
          numSuppressed,
        });
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('dce-expresskit could not send an error notification:', err);
      });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('dce-expresskit could not process an error notification:', err);
  }
};
