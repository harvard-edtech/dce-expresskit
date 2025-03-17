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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// Import dce-reactkit
var dce_reactkit_1 = require("dce-reactkit");
// Import data signer
var dataSigner_1 = require("../dataSigner");
// Import shared types
var ExpressKitErrorCode_1 = __importDefault(require("../../types/ExpressKitErrorCode"));
var sendServerToServerRequest_1 = __importDefault(require("./sendServerToServerRequest"));
/*------------------------------------------------------------------------*/
/* ----------------------------- Credentials ---------------------------- */
/*------------------------------------------------------------------------*/
/*
DCEKIT_CROSS_SERVER_CREDENTIALS format:
|host:key:secret||host:key:secret|...
*/
var credentials = (((_a = process.env.DCEKIT_CROSS_SERVER_CREDENTIALS) !== null && _a !== void 0 ? _a : '')
    // Replace multiple | with a single one
    .replace(/\|+/g, '|')
    // Split by |
    .split('|')
    // Remove empty strings
    .filter(function (str) {
    return str.trim().length > 0;
})
    // Process each credential
    .map(function (str) {
    // Split by :
    var parts = str.split(':');
    // Check for errors
    if (parts.length !== 3) {
        throw new dce_reactkit_1.ErrorWithCode('Invalid DCEKIT_CROSS_SERVER_CREDENTIALS format. Each credential must be in the format |host:key:secret|', ExpressKitErrorCode_1.default.InvalidCrossServerCredentialsFormat);
    }
    // Return the credential
    return {
        host: parts[0].trim(),
        key: parts[1].trim(),
        secret: parts[2].trim(),
    };
}));
/*------------------------------------------------------------------------*/
/* ------------------------------- Helpers ------------------------------ */
/*------------------------------------------------------------------------*/
/**
 * Get the credential to use for the request to another server
 * @author Gabe Abrams
 * @param host the host of the other server
 * @return the credential to use
 */
var getCrossServerCredential = function (host) {
    // Find the credential
    var credential = credentials.find(function (cred) {
        return cred.host.toLowerCase() === host.toLowerCase();
    });
    if (!credential) {
        throw new dce_reactkit_1.ErrorWithCode('Cannot send cross-server signed request there was no credential that matched the host that the request is being sent to.', ExpressKitErrorCode_1.default.CrossServerNoCredentialsToSignWith);
    }
    // Return credential
    return credential;
};
/*------------------------------------------------------------------------*/
/* -------------------------------- Main -------------------------------- */
/*------------------------------------------------------------------------*/
/**
 * Visit an endpoint on another server
 * @author Gabe Abrams
 * @param opts object containing all arguments
 * @param opts.method the method of the endpoint
 * @param opts.path the path of the other server's endpoint
 * @param opts.host the host of the other server
 * @param [opts.params={}] query/body parameters to include
 * @param [opts.responseType=JSON] the response type from the other server
 */
var visitEndpointOnAnotherServer = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    var credential, augmentedParams, response, body;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                credential = getCrossServerCredential(opts.host);
                return [4 /*yield*/, (0, dataSigner_1.signRequest)({
                        method: opts.method,
                        path: opts.path,
                        params: (_a = opts.params) !== null && _a !== void 0 ? _a : {},
                        key: credential.key,
                        secret: credential.secret,
                    })];
            case 1:
                augmentedParams = _b.sent();
                return [4 /*yield*/, (0, sendServerToServerRequest_1.default)({
                        path: opts.path,
                        host: opts.host,
                        method: opts.method,
                        params: augmentedParams,
                        responseType: opts.responseType,
                    })];
            case 2:
                response = _b.sent();
                // Check for failure
                if (!response || !response.body) {
                    throw new dce_reactkit_1.ErrorWithCode('We didn\'t get a response from the other server. Please check the network between the two connection.', dce_reactkit_1.ReactKitErrorCode.NoResponse);
                }
                if (!response.body.success) {
                    // Other errors
                    throw new dce_reactkit_1.ErrorWithCode((response.body.message
                        || 'An unknown error occurred. Please contact an admin.'), (response.body.code
                        || dce_reactkit_1.ReactKitErrorCode.NoCode));
                }
                body = response.body.body;
                // Return
                return [2 /*return*/, body];
        }
    });
}); };
exports.default = visitEndpointOnAnotherServer;
//# sourceMappingURL=index.js.map