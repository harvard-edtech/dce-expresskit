import VerifiedCourseAuth from '../types/VerifiedCourseAuth';
/**
 * Mint a signed course-context token for the caller's current, Canvas-verified
 * launch. The consumer app calls this (typically from a small endpoint) right
 * after a launch and hands the token to the client, which stores it per browser
 * tab and sends it back on each request (see COURSE_CONTEXT_HEADER).
 * @author Karen Dolan
 * @param opts object containing all arguments
 * @param opts.req the express request (must have a valid CACCL launch)
 * @param [opts.ttlMs=1 hour] how long the token should remain valid, in ms
 * @returns a signed course-context token string
 */
declare const genCourseContext: (opts: {
    req: any;
    ttlMs?: number;
}) => string;
/**
 * Verify a signed course-context token and return the course + roles it proves.
 * Throws an ErrorWithCode if the token is malformed, has a bad signature, has
 * expired, or was minted for a different user than the current session user.
 *
 * genRouteHandler calls this internally, so most consumers never need to. It is
 * exported for apps that build their own middleware.
 * @author Karen Dolan
 * @param opts object containing all arguments
 * @param opts.token the raw token string from the request header
 * @param [opts.expectedUserId] if provided, the token's user must match this
 *   (bind the token to the logged-in session user to prevent replay by others)
 * @returns the verified course authorization
 */
declare const verifyCourseContextToken: (opts: {
    token: string;
    expectedUserId?: number;
}) => VerifiedCourseAuth;
export { genCourseContext, verifyCourseContextToken, };
