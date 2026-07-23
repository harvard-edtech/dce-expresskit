/**
 * The decoded payload of a signed course-context token.
 *
 * A course-context token is a small, self-signed (HMAC) assertion that this
 * server minted at a Canvas-verified launch. It captures which course a user
 * launched, who they are, and what roles they hold in that course, so that a
 * single request can prove its own course context independently of the one
 * course the shared CACCL session happens to represent.
 *
 * This is the internal, over-the-wire shape. The verified result handed to
 * route handlers is the narrower VerifiedCourseAuth (no user id, no timestamps).
 *
 * @author Karen Dolan
 */
type CourseContextTokenPayload = {
  // The Canvas ID of the course this token authorizes
  courseId: number;
  // Human-readable name of the course (Canvas context label)
  courseName: string;
  // The Canvas user ID this token was minted for. Verified against the current
  // session user so a token cannot be replayed by a different user.
  userId: number;
  // True if the user is a learner in this course
  isLearner: boolean;
  // True if the user is a teaching team member in this course
  isTTM: boolean;
  // True if the user is an admin in this course
  isAdmin: boolean;
  // Issued-at time (ms since epoch)
  iat: number;
  // Expiry time (ms since epoch); the token is rejected after this moment
  exp: number;
};

export default CourseContextTokenPayload;
