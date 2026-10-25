/**
 * Per-request verified course authorization.
 *
 * A consumer app sets req.verifiedCourseAuth ONLY after it has
 * cryptographically verified that the requester is authorized for a specific
 * course with specific roles (for example, via a signed per-tab course token
 * minted at a Canvas-verified launch). When present, genRouteHandler prefers
 * it over the single shared session's launchInfo for that request's course,
 * roles, and identity — which is what lets multiple browser tabs work on
 * different courses despite sharing one session, and lets a verified request
 * outlive the session itself. When absent, behavior is unchanged.
 * @author Gabe Abrams
 */
type VerifiedCourseAuth = {
  // The course the requester is verified for
  courseId: number,
  // The user the verification was issued to
  userId: number,
  // True if the user is a plain course member in this course
  isLearner: boolean,
  // True if the user is a teaching team member in this course
  isTTM: boolean,
  // True if the user is a Canvas admin
  isAdmin: boolean,
  // Section ids of the user's launch into this course (from the launch's
  // custom section_ids param), captured by the consumer at verification
  // time so they stay faithful to THIS course even after the shared session
  // moves on. Optional: consumers that don't use sections may omit it
  sectionIds?: number[],
  // The user's first name (optional: used when the session cannot supply it)
  userFirstName?: string,
  // The user's last name (optional: used when the session cannot supply it)
  userLastName?: string,
  // The user's email (optional: used when the session cannot supply it)
  userEmail?: string,
};

// Augment Express so consumers can attach a verified auth to the request
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      // Per-request verified course authorization (set by the consumer app
      // only after cryptographic verification)
      verifiedCourseAuth?: VerifiedCourseAuth,
    }
  }
}

export default VerifiedCourseAuth;
