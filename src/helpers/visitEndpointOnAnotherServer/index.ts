// Import dce-reactkit
import {
  ErrorWithCode,
  ReactKitErrorCode,
} from 'dce-reactkit';

// Import shared types
import sendServerToServerRequest from './sendServerToServerRequest';

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
const visitEndpointOnAnotherServer = async (
  opts: {
    method: 'GET' | 'POST' | 'DELETE' | 'PUT',
    path: string,
    host: string,
    params?: { [key in string]: any },
    responseType?: 'JSON' | 'Text',
  },
): Promise<any> => {
  // Send the request
  const response = await sendServerToServerRequest({
    path: opts.path,
    host: opts.host,
    method: opts.method,
    params: opts.params,
    responseType: opts.responseType,
  });

  // Check for failure
  if (!response || !response.body) {
    throw new ErrorWithCode(
      'We didn\'t get a response from the other server. Please check the network between the two connection.',
      ReactKitErrorCode.NoResponse,
    );
  }
  if (!response.body.success) {
    // Other errors
    throw new ErrorWithCode(
      (
        response.body.message
        || 'An unknown error occurred. Please contact an admin.'
      ),
      (
        response.body.code
        || ReactKitErrorCode.NoCode
      ),
    );
  }

  // Success! Extract the body
  const { body } = response.body;

  // Return
  return body;
};

export default visitEndpointOnAnotherServer;
