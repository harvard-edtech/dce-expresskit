import { LogFunction, ParamType } from 'dce-reactkit';
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
declare const genRouteHandler: (opts: {
    paramTypes?: {
        [k: string]: ParamType;
    };
    handler: (opts: {
        params: {
            [k: string]: any;
        };
        req: any;
        next: () => void;
        redirect: (pathOrURL: string) => void;
        send: (text: string, status?: number) => void;
        renderErrorPage: (opts?: {
            title?: string;
            description?: string;
            code?: string;
            pageTitle?: string;
            status?: number;
        }) => void;
        renderInfoPage: (opts: {
            title: string;
            body: string;
        }) => void;
        renderCustomHTML: (opts: {
            html: string;
            status?: number;
        }) => void;
        logServerEvent: LogFunction;
    }) => any;
    crossServerScope?: string;
    skipSessionCheck?: boolean;
    unhandledErrorMessagePrefix?: string;
}) => (req: any, res: any, next: () => void) => Promise<undefined>;
export default genRouteHandler;
