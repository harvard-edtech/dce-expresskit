// Highest error code = DEK36

/**
 * List of error codes built into the express kit
 * @author Gabe Abrams
 */
enum ExpressKitErrorCode {
  // General errors
  WrongCourse = 'DEK6',
  NotTTM = 'DEK9',
  NotAdmin = 'DEK10',
  NotAllowedToReviewLogs = 'DEK11',
  ThemeCheckedBeforeReactKitReady = 'DEK12',
  InvalidParameter = 'DEK5',
  MissingParameter = 'DEK4',
  StudentIdMismatch = 'DEK36',

  // Server-to-server requests
  NotConnected = 'DEK14',
  SelfSigned = 'DEK15',
  ResponseParseError = 'DEK16',
  SignedRequestUnparseable = 'DEK28',
  SignedRequestInvalidCollection = 'DEK21',
  SignedRequestInvalidCredential = 'DEK23',
  SignedRequestInvalidScope = 'DEK22',
  SignedRequestInvalidTimestamp = 'DEK24',
  SignedRequestInvalidSignature = 'DEK25',
  SignedRequestInvalidBody = 'DEK26',
  CrossServerNoCredentialsToSignWith = 'DEK27',
  CrossServerMissingSignedRequestInfo = 'DEK29',
  CrossServerNoCredentialEncodingSalt = 'DEK30',
  NoOauthLib = 'DEK31',
  NoCryptoLib = 'DEK32',
  InvalidCrossServerCredentialsFormat = 'DEK33',
  UnknownCrossServerError = 'DEK34',
  NotSelectAdmin = 'DEK35',
}

export default ExpressKitErrorCode;
