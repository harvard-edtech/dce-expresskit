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
// Import libs
var qs_1 = __importDefault(require("qs"));
// Import dce-reactkit
var dce_reactkit_1 = require("dce-reactkit");
// Import data signer
var dataSigner_1 = require("../dataSigner");
// Import shared types
var ExpressKitErrorCode_1 = __importDefault(require("../../types/ExpressKitErrorCode"));
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
 * Sends and retries an http request
 * @author Gabriel Abrams
 * @param opts object containing all arguments
 * @param opts.path path to send request to
 * @param [opts.host] host to send request to
 * @param [opts.method=GET] http method to use
 * @param [opts.params] body/data to include in the request
 * @param [opts.responseType=JSON] expected response type
 * @returns { body, status, headers } on success
 */
var sendServerToServerRequest = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    var method, params, credential, augmentedParams, stringifiedParams, query, url, headers, data, encodedData, response, responseHeaders_1, responseBody, err_1, err_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                method = (opts.method || 'GET');
                if (opts.params) {
                    params = {};
                    Object.entries(opts.params).forEach(function (_a) {
                        var key = _a[0], val = _a[1];
                        if (typeof val === 'object' && !Array.isArray(val)) {
                            params[key] = JSON.stringify(val);
                        }
                        else {
                            params[key] = val;
                        }
                    });
                }
                credential = getCrossServerCredential(opts.host);
                return [4 /*yield*/, (0, dataSigner_1.signRequest)({
                        method: opts.method,
                        path: opts.path,
                        params: (_a = opts.params) !== null && _a !== void 0 ? _a : {},
                        key: credential.key,
                        secret: credential.secret,
                    })];
            case 1:
                augmentedParams = _c.sent();
                stringifiedParams = qs_1.default.stringify(augmentedParams || {}, {
                    encodeValuesOnly: true,
                    arrayFormat: 'brackets',
                });
                query = (method === 'GET' ? "?".concat(stringifiedParams) : '');
                if (!opts.host) {
                    // No host included at all. Just send to a path
                    url = "".concat(opts.path).concat(query);
                }
                else {
                    url = "https://".concat(opts.host).concat(opts.path).concat(query);
                }
                headers = {};
                data = null;
                if (!headers['Content-Type']) {
                    // Form encoded
                    headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    // Add data if applicable
                    data = (method !== 'GET' ? stringifiedParams : null);
                }
                else {
                    // JSON encode
                    data = augmentedParams;
                }
                if (data) {
                    if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
                        encodedData = new URLSearchParams(augmentedParams);
                    }
                    else {
                        encodedData = JSON.stringify(data);
                    }
                }
                _c.label = 2;
            case 2:
                _c.trys.push([2, 11, , 12]);
                return [4 /*yield*/, fetch(url, {
                        method: method,
                        mode: 'cors',
                        headers: headers !== null && headers !== void 0 ? headers : {},
                        body: ((method !== 'GET' && encodedData)
                            ? encodedData
                            : undefined),
                        redirect: 'follow',
                    })];
            case 3:
                response = _c.sent();
                responseHeaders_1 = {};
                response.headers.forEach(function (value, key) {
                    responseHeaders_1[key] = value;
                });
                _c.label = 4;
            case 4:
                _c.trys.push([4, 9, , 10]);
                responseBody = void 0;
                if (!(opts.responseType
                    && opts.responseType === 'Text')) return [3 /*break*/, 6];
                return [4 /*yield*/, response.text()];
            case 5:
                // Response type is text
                responseBody = _c.sent();
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, response.json()];
            case 7:
                // Response type is JSON
                responseBody = _c.sent();
                _c.label = 8;
            case 8: 
            // Return response
            return [2 /*return*/, {
                    body: responseBody,
                    status: response.status,
                    headers: responseHeaders_1,
                }];
            case 9:
                err_1 = _c.sent();
                throw new dce_reactkit_1.ErrorWithCode("Failed to parse response as ".concat(opts.responseType, ": ").concat(err_1 === null || err_1 === void 0 ? void 0 : err_1.message), ExpressKitErrorCode_1.default.ResponseParseError);
            case 10: return [3 /*break*/, 12];
            case 11:
                err_2 = _c.sent();
                // Self-signed certificate error:
                if ((_b = err_2 === null || err_2 === void 0 ? void 0 : err_2.message) === null || _b === void 0 ? void 0 : _b.includes('self signed certificate')) {
                    throw new dce_reactkit_1.ErrorWithCode('We refused to send a request because the receiver has self-signed certificates.', ExpressKitErrorCode_1.default.SelfSigned);
                }
                // No tries left
                throw new dce_reactkit_1.ErrorWithCode("We encountered an error when trying to send a network request. If this issue persists, contact an admin. Error: ".concat(err_2 === null || err_2 === void 0 ? void 0 : err_2.message), ExpressKitErrorCode_1.default.NotConnected);
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.default = sendServerToServerRequest;
//# sourceMappingURL=sendServerToServerRequest.js.map