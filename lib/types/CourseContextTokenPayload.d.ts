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
    courseId: number;
    courseName: string;
    userId: number;
    isLearner: boolean;
    isTTM: boolean;
    isAdmin: boolean;
    iat: number;
    exp: number;
};
export default CourseContextTokenPayload;
