"use strict";
// Highest error code = DEK36
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * List of error codes built into the express kit
 * @author Gabe Abrams
 */
var ExpressKitErrorCode;
(function (ExpressKitErrorCode) {
    // General errors
    ExpressKitErrorCode["WrongCourse"] = "DEK6";
    ExpressKitErrorCode["NotTTM"] = "DEK9";
    ExpressKitErrorCode["NotAdmin"] = "DEK10";
    ExpressKitErrorCode["NotAllowedToReviewLogs"] = "DEK11";
    ExpressKitErrorCode["ThemeCheckedBeforeReactKitReady"] = "DEK12";
    ExpressKitErrorCode["InvalidParameter"] = "DEK5";
    ExpressKitErrorCode["MissingParameter"] = "DEK4";
    ExpressKitErrorCode["StudentIdMismatch"] = "DEK36";
    // Server-to-server requests
    ExpressKitErrorCode["NotConnected"] = "DEK14";
    ExpressKitErrorCode["SelfSigned"] = "DEK15";
    ExpressKitErrorCode["ResponseParseError"] = "DEK16";
    ExpressKitErrorCode["SignedRequestUnparseable"] = "DEK28";
    ExpressKitErrorCode["SignedRequestInvalidCollection"] = "DEK21";
    ExpressKitErrorCode["SignedRequestInvalidCredential"] = "DEK23";
    ExpressKitErrorCode["SignedRequestInvalidScope"] = "DEK22";
    ExpressKitErrorCode["SignedRequestInvalidTimestamp"] = "DEK24";
    ExpressKitErrorCode["SignedRequestInvalidSignature"] = "DEK25";
    ExpressKitErrorCode["SignedRequestInvalidBody"] = "DEK26";
    ExpressKitErrorCode["CrossServerNoCredentialsToSignWith"] = "DEK27";
    ExpressKitErrorCode["CrossServerMissingSignedRequestInfo"] = "DEK29";
    ExpressKitErrorCode["CrossServerNoCredentialEncodingSalt"] = "DEK30";
    ExpressKitErrorCode["NoOauthLib"] = "DEK31";
    ExpressKitErrorCode["NoCryptoLib"] = "DEK32";
    ExpressKitErrorCode["InvalidCrossServerCredentialsFormat"] = "DEK33";
    ExpressKitErrorCode["UnknownCrossServerError"] = "DEK34";
    ExpressKitErrorCode["NotSelectAdmin"] = "DEK35";
})(ExpressKitErrorCode || (ExpressKitErrorCode = {}));
exports.default = ExpressKitErrorCode;
//# sourceMappingURL=ExpressKitErrorCode.js.map