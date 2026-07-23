"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCourseContextToken = exports.genCourseContext = void 0;
// Import dce-commonkit
var dce_commonkit_1 = require("dce-commonkit");
// Import caccl
var server_1 = require("caccl/server");
// Import node libs
var crypto_1 = __importDefault(require("crypto"));
// Import shared types
var ExpressKitErrorCode_1 = __importDefault(require("../types/ExpressKitErrorCode"));
/*------------------------------------------------------------------------*/
/* ------------------------------ Constants ----------------------------- */
/*------------------------------------------------------------------------*/
// How long a freshly minted course-context token is valid for, in ms.
// Tokens are short-lived: the client re-mints when one expires. Kept modest so
// a stolen token has a small window, but long enough to cover a work session.
var DEFAULT_COURSE_CONTEXT_TTL_MS = dce_commonkit_1.HOUR_IN_MS;
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
var getCourseContextSecret = function () {
    var DCEKIT_COURSE_CONTEXT_SECRET = process.env.DCEKIT_COURSE_CONTEXT_SECRET;
    if (!DCEKIT_COURSE_CONTEXT_SECRET) {
        throw new dce_commonkit_1.ErrorWithCode('We could not process the course context for this request because the server is missing its course-context signing secret. Please contact support.', ExpressKitErrorCode_1.default.CourseContextNoSecret);
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
var signEncodedPayload = function (opts) {
    return (crypto_1.default
        .createHmac('sha256', opts.secret)
        .update(opts.encodedPayload)
        .digest('base64url'));
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
var genCourseContext = function (opts) {
    var _a;
    // Read the launch info: the launch is our root of trust for who the user is
    // and which course + roles they actually have right now.
    var _b = (0, server_1.getLaunchInfo)(opts.req), launched = _b.launched, launchInfo = _b.launchInfo;
    if (!launched || !launchInfo) {
        throw new dce_commonkit_1.ErrorWithCode('We could not create a course context because your session has expired. Please refresh the page and try again.', ExpressKitErrorCode_1.default.CourseContextInvalid);
    }
    // Build the token payload from the verified launch
    var now = Date.now();
    var payload = {
        courseId: launchInfo.courseId,
        courseName: launchInfo.contextLabel,
        userId: launchInfo.userId,
        isLearner: !!launchInfo.isLearner,
        isTTM: !!launchInfo.isTTM,
        isAdmin: !!launchInfo.isAdmin,
        iat: now,
        exp: now + ((_a = opts.ttlMs) !== null && _a !== void 0 ? _a : DEFAULT_COURSE_CONTEXT_TTL_MS),
    };
    // Encode and sign
    var encodedPayload = (Buffer
        .from(JSON.stringify(payload), 'utf8')
        .toString('base64url'));
    var secret = getCourseContextSecret();
    var signature = signEncodedPayload({
        encodedPayload: encodedPayload,
        secret: secret,
    });
    // Token is "<encodedPayload>.<signature>"
    return "".concat(encodedPayload, ".").concat(signature);
};
exports.genCourseContext = genCourseContext;
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
var verifyCourseContextToken = function (opts) {
    var secret = getCourseContextSecret();
    // Split into payload + signature
    var parts = opts.token.split('.');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
        throw new dce_commonkit_1.ErrorWithCode('We could not verify your course context because the token was malformed. Please refresh the page and try again.', ExpressKitErrorCode_1.default.CourseContextInvalid);
    }
    var encodedPayload = parts[0], signature = parts[1];
    // Verify the signature with a constant-time comparison
    var expectedSignature = signEncodedPayload({
        encodedPayload: encodedPayload,
        secret: secret,
    });
    var signatureBuffer = Buffer.from(signature);
    var expectedBuffer = Buffer.from(expectedSignature);
    if (signatureBuffer.length !== expectedBuffer.length
        || !crypto_1.default.timingSafeEqual(signatureBuffer, expectedBuffer)) {
        throw new dce_commonkit_1.ErrorWithCode('We could not verify your course context because its signature was invalid. Please refresh the page and try again.', ExpressKitErrorCode_1.default.CourseContextInvalid);
    }
    // Decode the payload (signature already proves it was not tampered with)
    var payload;
    try {
        var decoded = (Buffer
            .from(encodedPayload, 'base64url')
            .toString('utf8'));
        payload = JSON.parse(decoded);
    }
    catch (err) {
        throw new dce_commonkit_1.ErrorWithCode('We could not verify your course context because its contents could not be read. Please refresh the page and try again.', ExpressKitErrorCode_1.default.CourseContextInvalid);
    }
    // Reject expired tokens
    if (typeof payload.exp !== 'number'
        || Date.now() > payload.exp) {
        throw new dce_commonkit_1.ErrorWithCode('Your course context has expired. Please refresh the page and try again.', ExpressKitErrorCode_1.default.CourseContextExpired);
    }
    // Bind the token to the current session user, if one was provided
    if (opts.expectedUserId !== undefined
        && payload.userId !== opts.expectedUserId) {
        throw new dce_commonkit_1.ErrorWithCode('We could not verify your course context because it does not match the signed-in user. Please refresh the page and try again.', ExpressKitErrorCode_1.default.CourseContextUserMismatch);
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
exports.verifyCourseContextToken = verifyCourseContextToken;
//# sourceMappingURL=courseContext.js.map