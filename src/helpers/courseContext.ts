// Import dce-commonkit
import {
  ErrorWithCode,
  HOUR_IN_MS,
} from 'dce-commonkit';

// Import caccl
import { getLaunchInfo } from 'caccl/server';

// Import node libs
import crypto from 'crypto';

// Import shared types
import ExpressKitErrorCode from '../types/ExpressKitErrorCode';
import CourseContextTokenPayload from '../types/CourseContextTokenPayload';
import VerifiedCourseAuth from '../types/VerifiedCourseAuth';

/*------------------------------------------------------------------------*/
/* ------------------------------ Constants ----------------------------- */
/*------------------------------------------------------------------------*/

// How long a freshly minted course-context token is valid for, in ms.
// Tokens are short-lived: the client re-mints when one expires. Kept modest so
// a stolen token has a small window, but long enough to cover a work session.
const DEFAULT_COURSE_CONTEXT_TTL_MS = HOUR_IN_MS;

/*------------------------------------------------------------------------*/
/* ------------------------------- Helpers ------------------------------ */
/*------------------------------------------------------------------------*/

/**
 * Read the server's course-context signing secret from the environment.
 * This secret never leaves the server: it signs tokens on mint and verifies
 * them on each request, so the same server is the only party that can issue a
 * token the same server will trust.
 * @author Karen Dolan
 * @returns the signing secret
 */
const getCourseContextSecret = (): string => {
  const { DCEKIT_COURSE_CONTEXT_SECRET } = process.env;
  if (!DCEKIT_COURSE_CONTEXT_SECRET) {
    throw new ErrorWithCode(
      'We could not process the course context for this request because the server is missing its course-context signing secret. Please contact support.',
      ExpressKitErrorCode.CourseContextNoSecret,
    );
  }
  return DCEKIT_COURSE_CONTEXT_SECRET;
};

/**
 * Compute the base64url HMAC-SHA256 signature of an encoded payload.
 * @author Karen Dolan
 * @param opts object containing all arguments
 * @param opts.encodedPayload the base64url-encoded payload to sign
 * @param opts.secret the signing secret
 * @returns the base64url signature
 */
const signEncodedPayload = (
  opts: {
    encodedPayload: string,
    secret: string,
  },
): string => {
  return (
    crypto
      .createHmac('sha256', opts.secret)
      .update(opts.encodedPayload)
      .digest('base64url')
  );
};

/*------------------------------------------------------------------------*/
/* -------------------------------- Mint -------------------------------- */
/*------------------------------------------------------------------------*/

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
const genCourseContext = (
  opts: {
    req: any,
    ttlMs?: number,
  },
): string => {
  // Read the launch info: the launch is our root of trust for who the user is
  // and which course + roles they actually have right now.
  const {
    launched,
    launchInfo,
  } = getLaunchInfo(opts.req);
  if (!launched || !launchInfo) {
    throw new ErrorWithCode(
      'We could not create a course context because your session has expired. Please refresh the page and try again.',
      ExpressKitErrorCode.CourseContextInvalid,
    );
  }

  // Build the token payload from the verified launch
  const now = Date.now();
  const payload: CourseContextTokenPayload = {
    courseId: launchInfo.courseId,
    courseName: launchInfo.contextLabel,
    userId: launchInfo.userId,
    isLearner: !!launchInfo.isLearner,
    isTTM: !!launchInfo.isTTM,
    isAdmin: !!launchInfo.isAdmin,
    iat: now,
    exp: now + (opts.ttlMs ?? DEFAULT_COURSE_CONTEXT_TTL_MS),
  };

  // Encode and sign
  const encodedPayload = (
    Buffer
      .from(JSON.stringify(payload), 'utf8')
      .toString('base64url')
  );
  const secret = getCourseContextSecret();
  const signature = signEncodedPayload({
    encodedPayload,
    secret,
  });

  // Token is "<encodedPayload>.<signature>"
  return `${encodedPayload}.${signature}`;
};

/*------------------------------------------------------------------------*/
/* ------------------------------- Verify ------------------------------- */
/*------------------------------------------------------------------------*/

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
const verifyCourseContextToken = (
  opts: {
    token: string,
    expectedUserId?: number,
  },
): VerifiedCourseAuth => {
  const secret = getCourseContextSecret();

  // Split into payload + signature
  const parts = opts.token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new ErrorWithCode(
      'We could not verify your course context because the token was malformed. Please refresh the page and try again.',
      ExpressKitErrorCode.CourseContextInvalid,
    );
  }
  const [
    encodedPayload,
    signature,
  ] = parts;

  // Verify the signature with a constant-time comparison
  const expectedSignature = signEncodedPayload({
    encodedPayload,
    secret,
  });
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (
    signatureBuffer.length !== expectedBuffer.length
    || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    throw new ErrorWithCode(
      'We could not verify your course context because its signature was invalid. Please refresh the page and try again.',
      ExpressKitErrorCode.CourseContextInvalid,
    );
  }

  // Decode the payload (signature already proves it was not tampered with)
  let payload: CourseContextTokenPayload;
  try {
    const decoded = (
      Buffer
        .from(encodedPayload, 'base64url')
        .toString('utf8')
    );
    payload = JSON.parse(decoded);
  } catch (err) {
    throw new ErrorWithCode(
      'We could not verify your course context because its contents could not be read. Please refresh the page and try again.',
      ExpressKitErrorCode.CourseContextInvalid,
    );
  }

  // Reject expired tokens
  if (
    typeof payload.exp !== 'number'
    || Date.now() > payload.exp
  ) {
    throw new ErrorWithCode(
      'Your course context has expired. Please refresh the page and try again.',
      ExpressKitErrorCode.CourseContextExpired,
    );
  }

  // Bind the token to the current session user, if one was provided
  if (
    opts.expectedUserId !== undefined
    && payload.userId !== opts.expectedUserId
  ) {
    throw new ErrorWithCode(
      'We could not verify your course context because it does not match the signed-in user. Please refresh the page and try again.',
      ExpressKitErrorCode.CourseContextUserMismatch,
    );
  }

  // Hand back only the narrow, verified course authorization
  return {
    courseId: payload.courseId,
    courseName: payload.courseName,
    isLearner: !!payload.isLearner,
    isTTM: !!payload.isTTM,
    isAdmin: !!payload.isAdmin,
  };
};

export {
  genCourseContext,
  verifyCourseContextToken,
};
