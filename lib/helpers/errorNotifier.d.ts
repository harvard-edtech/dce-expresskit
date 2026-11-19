import { Log } from 'dce-commonkit';
/**
 * Info about an error that the app should be notified about
 * @author Yuen Ler Chow
 */
export type ErrorNotification = {
    log: Log;
    httpStatus?: number;
    numSuppressed: number;
};
/**
 * Options for notifying the app when errors occur
 * @author Yuen Ler Chow
 */
export type ErrorNotifierOpts = {
    notify: (notification: ErrorNotification) => (void | Promise<void>);
    shouldNotify?: (opts: {
        log: Log;
        httpStatus?: number;
        notifyByDefault: boolean;
    }) => boolean;
    throttleMins?: number;
};
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
export declare const notifyByDefault: (log: Log, httpStatus?: number) => boolean;
/**
 * Set up error notifications (called by initServer)
 * @author Yuen Ler Chow
 * @param [opts] notifier options. If excluded, no notifications are sent
 */
export declare const initErrorNotifier: (opts?: ErrorNotifierOpts) => void;
/**
 * Notify the app about an error log if needed. Never throws and never
 *   waits for the notification to be sent.
 * @author Yuen Ler Chow
 * @param log the log that was created
 * @param [httpStatus] the http status that was sent to the user
 */
export declare const handleErrorLog: (log: Log, httpStatus?: number) => void;
