import express from 'express';
import COURSE_CONTEXT_HEADER from '../constants/COURSE_CONTEXT_HEADER';
/**
 * Add an endpoint that mints a signed course-context token for the caller's
 * current, Canvas-verified launch.
 *
 * This is the bootstrap for per-tab course contexts: the client calls this
 * endpoint once right after a launch, stores the returned token per browser tab,
 * and then sends it back on every subsequent request in the COURSE_CONTEXT_HEADER
 * header (genRouteHandler verifies it). Because the token is derived from the
 * session launch, this endpoint runs behind the normal session check — a user
 * can only mint a context for a course they actually launched.
 *
 * The endpoint responds with the token as a plain string (wrapped in the
 * standard success envelope), so the client can read it directly.
 *
 * @author Karen Dolan
 * @param opts object containing all arguments
 * @param opts.app the express app to add the endpoint to
 * @param [opts.path=/api/course-context] the path to mount the endpoint at.
 *   Keep it under /api (all authorized users) — never /api/ttm or /api/admin,
 *   because every launched user legitimately needs to mint their own context.
 * @param [opts.ttlMs] how long each minted token should remain valid, in ms
 *   (defaults to the library default inside genCourseContext)
 * @example
 * // Server: wire the endpoint once while setting up routes
 * import express from 'express';
 * import { addCourseContextEndpoint } from 'dce-expresskit';
 *
 * const app = express();
 * addCourseContextEndpoint({ app });
 * // → GET /api/course-context now returns a signed token for the launch
 */
declare const addCourseContextEndpoint: (opts: {
    app: express.Application;
    path?: string;
    ttlMs?: number;
}) => void;
export { COURSE_CONTEXT_HEADER };
export default addCourseContextEndpoint;
