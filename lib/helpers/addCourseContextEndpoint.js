"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COURSE_CONTEXT_HEADER = void 0;
// Import shared helpers
var genRouteHandler_1 = __importDefault(require("./genRouteHandler"));
var courseContext_1 = require("./courseContext");
// Import shared constants
var COURSE_CONTEXT_HEADER_1 = __importDefault(require("../constants/COURSE_CONTEXT_HEADER"));
exports.COURSE_CONTEXT_HEADER = COURSE_CONTEXT_HEADER_1.default;
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
var addCourseContextEndpoint = function (opts) {
    // Destructure opts with a sensible default path
    var app = opts.app, _a = opts.path, path = _a === void 0 ? '/api/course-context' : _a, ttlMs = opts.ttlMs;
    /**
     * Mint a course-context token for the current launch
     * @author Karen Dolan
     * @returns a signed course-context token string
     */
    app.get(path, (0, genRouteHandler_1.default)({
        handler: function (handlerOpts) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // genRouteHandler has already enforced a valid session/launch, so the
                // request is safe to mint a token from.
                return [2 /*return*/, (0, courseContext_1.genCourseContext)({
                        req: handlerOpts.req,
                        ttlMs: ttlMs,
                    })];
            });
        }); },
    }));
};
exports.default = addCourseContextEndpoint;
//# sourceMappingURL=addCourseContextEndpoint.js.map