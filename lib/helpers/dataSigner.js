"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.validateSignedRequest = exports.signRequest = void 0;
// Import dce-reactkit
var dce_reactkit_1 = require("dce-reactkit");
// Import oauth
var oauth_signature_1 = __importDefault(require("oauth-signature"));
// Import crypto
var crypto_1 = __importDefault(require("crypto"));
// Import shared helpers
var initServer_1 = require("./initServer");
// Import shared types
var ExpressKitErrorCode_1 = __importDefault(require("../types/ExpressKitErrorCode"));
/*------------------------------------------------------------------------*/
/* ------------------------------- Helpers ------------------------------ */
/*------------------------------------------------------------------------*/
/**
 * Generate an oauth signature
 * @author Gabe Abrams
 * @param opts object containing all arguments
 * @param opts.method the http method
 * @param opts.path the http request path
 * @param opts.params the data in the body to sign
 * @param opts.secret the secret to sign with
 * @return the signature
 */
var genSignature = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    var method, path, params, secret, keys, orderedParams;
    return __generator(this, function (_a) {
        method = opts.method, path = opts.path, params = opts.params, secret = opts.secret;
        keys = Object.keys(params !== null && params !== void 0 ? params : {});
        keys.sort();
        orderedParams = {};
        keys.forEach(function (key) {
            // Skip oauth_signature
            if (key === 'oauth_signature') {
                return;
            }
            // Add the param
            orderedParams[key] = (params !== null && params !== void 0 ? params : {})[key];
        });
        console.log('Ordered:', orderedParams);
        // Generate the signature
        return [2 /*return*/, decodeURIComponent(oauth_signature_1.default.generate(method !== null && method !== void 0 ? method : 'GET', path !== null && path !== void 0 ? path : 'no-path', orderedParams, secret))];
    });
}); };
/**
 * Decrypt an encrypted string using a secret
 * @author Gabe Abrams
 * @param str the encrypted string
 * @return the decrypted string
 */
var decrypt = function (encryptedPack) { return __awaiter(void 0, void 0, void 0, function () {
    var DCEKIT_CRED_ENCODING_SALT, _a, ciphertext, iv, tag, decipher, str;
    return __generator(this, function (_b) {
        DCEKIT_CRED_ENCODING_SALT = process.env.DCEKIT_CRED_ENCODING_SALT;
        if (!DCEKIT_CRED_ENCODING_SALT) {
            throw new dce_reactkit_1.ErrorWithCode('Could not decrypt a string because the encryption salt was not set.', ExpressKitErrorCode_1.default.CrossServerNoCredentialEncodingSalt);
        }
        _a = JSON.parse(decodeURIComponent(encryptedPack)), ciphertext = _a.ciphertext, iv = _a.iv, tag = _a.tag;
        decipher = crypto_1.default.createDecipheriv('aes-256-gcm', Buffer.from(DCEKIT_CRED_ENCODING_SALT, 'base64'), Buffer.from(iv, 'base64'));
        // Set the authentication tag
        decipher.setAuthTag(Buffer.from(tag, 'base64'));
        str = decipher.update(ciphertext, 'base64', 'utf8');
        str += decipher.final('utf8');
        // Return the decrypted string
        return [2 /*return*/, str];
    });
}); };
/*------------------------------------------------------------------------*/
/* ------------------------------- Signing ------------------------------ */
/*------------------------------------------------------------------------*/
/**
 * Sign a request and get the new request params
 * @author Gabe Abrams
 * @param opts object containing all arguments
 * @param opts.method the method to sign
 * @param opts.path the http request path
 * @param opts.params the data in the body to sign
 * @param opts.key the dcekit key to sign with
 * @param opts.secret the dcekit secret to sign with
 * @return augmented params for the request, including a signature, timestamp, and key
 */
var signRequest = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    var method, path, params, key, secret, augmentedParams, signature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                method = opts.method.toUpperCase();
                path = opts.path, params = opts.params, key = opts.key, secret = opts.secret;
                augmentedParams = __assign(__assign({}, params), { oauth_consumer_key: key, oauth_nonce: Math.random().toString(36), oauth_timestamp: Date.now() });
                return [4 /*yield*/, genSignature({
                        method: method,
                        path: path,
                        params: params,
                        secret: secret,
                    })];
            case 1:
                signature = _a.sent();
                // Add signature to the augmented params
                augmentedParams.oauth_signature = signature;
                // Return the augmented params
                return [2 /*return*/, augmentedParams];
        }
    });
}); };
exports.signRequest = signRequest;
/**
 * Validate a signed request. Throws an error if invalid
 * @author Gabe Abrams
 * @param opts object containing all arguments
 * @param opts.method the method of the data validate
 * @param opts.path the http request path to validate
 * @param opts.scope the name of the scope to validate
 * @param opts.params the request data to validate
 * @returns parsed and validated params
 */
var validateSignedRequest = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    var signature, timestamp, key, method, path, params, scope, crossServerCredentialCollection, crossServerCredentialMatches, crossServerCredential, allowedScopes, secret, paramsToSign, expectedSignature, elapsedMs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                /* ---------- Collect Info ---------- */
                // Get the signature
                if (!opts.params.oauth_signature) {
                    throw new dce_reactkit_1.ErrorWithCode('Could not validate a cross-server request there was no oauth signature.', ExpressKitErrorCode_1.default.CrossServerMissingSignedRequestInfo);
                }
                signature = opts.params.oauth_signature;
                // Get the timestamp
                if (
                // No timestamp
                !opts.params.oauth_timestamp
                    // Invalid timestamp
                    || Number.isNaN(Number.parseInt(opts.params.oauth_timestamp, 10))) {
                    throw new dce_reactkit_1.ErrorWithCode('Could not validate a cross-server request there was no valid oauth timestamp.', ExpressKitErrorCode_1.default.CrossServerMissingSignedRequestInfo);
                }
                timestamp = Number.parseInt(opts.params.oauth_timestamp, 10);
                // Get the key
                if (!opts.params.oauth_consumer_key) {
                    throw new dce_reactkit_1.ErrorWithCode('Could not validate a cross-server request there was no oauth consumer key.', ExpressKitErrorCode_1.default.CrossServerMissingSignedRequestInfo);
                }
                key = opts.params.oauth_consumer_key;
                method = opts.method, path = opts.path, params = opts.params, scope = opts.scope;
                crossServerCredentialCollection = (0, initServer_1.internalGetCrossServerCredentialCollection)();
                if (!crossServerCredentialCollection) {
                    throw new dce_reactkit_1.ErrorWithCode('Could not validate a cross-server request because the cross-server credential collection was not ready in time.', ExpressKitErrorCode_1.default.SignedRequestInvalidCollection);
                }
                return [4 /*yield*/, crossServerCredentialCollection.find({ key: key })];
            case 1:
                crossServerCredentialMatches = _a.sent();
                if (!crossServerCredentialMatches || crossServerCredentialMatches.length === 0) {
                    throw new dce_reactkit_1.ErrorWithCode('Could not validate a cross-server request because the credential was not found.', ExpressKitErrorCode_1.default.SignedRequestInvalidCredential);
                }
                crossServerCredential = crossServerCredentialMatches[0];
                allowedScopes = crossServerCredential.scopes;
                if (!allowedScopes || !Array.isArray(allowedScopes)) {
                    throw new dce_reactkit_1.ErrorWithCode('Could not validate a cross-server request because the credential does not have access to any scopes.', ExpressKitErrorCode_1.default.SignedRequestInvalidScope);
                }
                if (!allowedScopes.includes(scope)) {
                    throw new dce_reactkit_1.ErrorWithCode('Could not validate a cross-server request because the required scope was not approved for the credential.', ExpressKitErrorCode_1.default.SignedRequestInvalidScope);
                }
                return [4 /*yield*/, decrypt(crossServerCredential.encodedeSecret)];
            case 2:
                secret = _a.sent();
                paramsToSign = __assign({}, params);
                Object.keys(paramsToSign).forEach(function (key) {
                    // Delete oauth params
                    if (key.startsWith('oauth_')) {
                        delete paramsToSign[key];
                    }
                });
                // Generate a new signature to compare
                console.log('paramsToSign', method, path, paramsToSign, secret);
                return [4 /*yield*/, genSignature({
                        method: method,
                        path: path,
                        params: paramsToSign,
                        secret: secret,
                    })];
            case 3:
                expectedSignature = _a.sent();
                // Make sure the signatures match
                if (signature !== expectedSignature) {
                    throw new dce_reactkit_1.ErrorWithCode('Could not validate a cross-server request because the signature did not match.', ExpressKitErrorCode_1.default.SignedRequestInvalidSignature);
                }
                elapsedMs = Math.abs(Date.now() - timestamp);
                if (elapsedMs > dce_reactkit_1.MINUTE_IN_MS) {
                    throw new dce_reactkit_1.ErrorWithCode('Could not validate a cross-server request because the request was too old.', ExpressKitErrorCode_1.default.SignedRequestInvalidTimestamp);
                }
                return [2 /*return*/];
        }
    });
}); };
exports.validateSignedRequest = validateSignedRequest;
//# sourceMappingURL=dataSigner.js.map