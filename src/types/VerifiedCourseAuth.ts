/**
 * An already-verified, per-request course authorization.
 *
 * This lets a consumer app tell genRouteHandler which course (and which roles)
 * a single request is really about, independently of the one course the shared
 * CACCL session happened to launch. That is what makes it possible to have
 * multiple browser tabs open on *different* courses at the same time: each
 * request carries its own verified course context instead of relying on the
 * single, shared session launch.
 *
 * PHASE 0 TRUST CONTRACT (interim):
 *   Right now the library trusts this value exactly as the app sets it, so the
 *   consumer app is responsible for cryptographically verifying it before
 *   attaching it to the request (for example, by validating a token that this
 *   same server signed at a Canvas-verified launch, and confirming that the
 *   token's user matches the current session user).
 *
 *   A later release will move that verification into the library itself
 *   (minting and verifying a signed "course context" token). At that point this
 *   same field becomes an output the library populates, rather than an input the
 *   app supplies — the shape below does not change.
 *
 * @author Karen Dolan
 */
type VerifiedCourseAuth = {
  // The Canvas ID of the verified course this request is about
  courseId: number;
  // Human-readable name of the verified course, if known. When present, it is
  // used for the request's audit log so the log reflects the verified course
  // (not the shared session launch). Optional because a caller may only have
  // verified the course ID and roles.
  courseName?: string;
  // True if the user is a learner in the verified course
  isLearner: boolean;
  // True if the user is a teaching team member in the verified course
  isTTM: boolean;
  // True if the user is an admin in the verified course
  isAdmin: boolean;
};

/**
 * Augment the Express Request type so consumer apps get type safety when they
 * attach a verified course auth (for example, from their own auth middleware).
 * Inside the library, req is treated as `any`, so this augmentation exists purely
 * for the benefit of consumers of the package.
 * @author Karen Dolan
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      // An already-verified, per-request course authorization (see above)
      verifiedCourseAuth?: VerifiedCourseAuth;
    }
  }
}

export default VerifiedCourseAuth;
