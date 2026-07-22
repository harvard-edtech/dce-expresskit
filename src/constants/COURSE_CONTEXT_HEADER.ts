/**
 * Name of the HTTP header that carries a signed course-context token.
 *
 * The client (for example, dce-reactkit's visitServerEndpoint) sends the token
 * in this header, and genRouteHandler reads it to verify the per-request course
 * context. Kept in a shared constant so the client and server never drift apart
 * on the exact header name.
 *
 * Note: Express lower-cases incoming header names, so read it as
 * req.headers['x-course-context'].
 *
 * @author Karen Dolan
 */
const COURSE_CONTEXT_HEADER = 'X-Course-Context';

export default COURSE_CONTEXT_HEADER;
