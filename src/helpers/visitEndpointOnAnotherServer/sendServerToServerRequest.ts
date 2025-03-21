// Import libs
import qs from 'qs';

// Import dce-reactkit
import {
  ErrorWithCode,
} from 'dce-reactkit';

// Import data signer
import { signRequest } from '../dataSigner';

// Import shared types
import ExpressKitErrorCode from '../../types/ExpressKitErrorCode';

/*------------------------------------------------------------------------*/
/* ----------------------------- Credentials ---------------------------- */
/*------------------------------------------------------------------------*/

/*
DCEKIT_CROSS_SERVER_CREDENTIALS format:
|host:key:secret||host:key:secret|...
*/

const credentials: {
  host: string,
  key: string,
  secret: string,
}[] = (
    (process.env.DCEKIT_CROSS_SERVER_CREDENTIALS ?? '')
      // Replace multiple | with a single one
      .replace(/\|+/g, '|')
      // Split by |
      .split('|')
      // Remove empty strings
      .filter((str) => {
        return str.trim().length > 0;
      })
      // Process each credential
      .map((str) => {
        // Split by :
        const parts = str.split(':');

        // Check for errors
        if (parts.length !== 3) {
          throw new ErrorWithCode(
            'Invalid DCEKIT_CROSS_SERVER_CREDENTIALS format. Each credential must be in the format |host:key:secret|',
            ExpressKitErrorCode.InvalidCrossServerCredentialsFormat,
          );
        }

        // Return the credential
        return {
          host: parts[0].trim(),
          key: parts[1].trim(),
          secret: parts[2].trim(),
        };
      })
  );

/*------------------------------------------------------------------------*/
/* ------------------------------- Helpers ------------------------------ */
/*------------------------------------------------------------------------*/

/**
 * Get the credential to use for the request to another server
 * @author Gabe Abrams
 * @param host the host of the other server
 * @return the credential to use
 */
const getCrossServerCredential = (host: string) => {
  // Find the credential
  const credential = credentials.find((cred) => {
    return cred.host.toLowerCase() === host.toLowerCase();
  });
  if (!credential) {
    throw new ErrorWithCode(
      'Cannot send cross-server signed request there was no credential that matched the host that the request is being sent to.',
      ExpressKitErrorCode.CrossServerNoCredentialsToSignWith,
    );
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
const sendServerToServerRequest = async (
  opts: {
    path: string,
    host?: string,
    method?: ('GET' | 'POST' | 'PUT' | 'DELETE'),
    params?: { [k in string]: any },
    responseType?: 'Text' | 'JSON',
  },
): Promise<{
  body: any,
  status: number,
  headers: { [k in string]: any },
}> => {
  // Process method
  const method: ('GET' | 'POST' | 'PUT' | 'DELETE') = (opts.method || 'GET');

  // Encode objects within params
  let params: {
    [k in string]: any
  } | undefined;
  if (opts.params) {
    params = {};
    Object.entries(opts.params).forEach(([key, val]) => {
      if (typeof val === 'object' && !Array.isArray(val)) {
        (params as any)[key] = JSON.stringify(val);
      } else {
        (params as any)[key] = val;
      }
    });
  }

  // Get cross-server credential
  const credential = getCrossServerCredential(opts.host);

  // Sign the request, get new params
  const augmentedParams = await signRequest({
    method: opts.method,
    path: opts.path,
    params: opts.params ?? {},
    key: credential.key,
    secret: credential.secret,
  });

  // Stringify parameters
  const stringifiedParams = qs.stringify(
    augmentedParams || {},
    {
      encodeValuesOnly: true,
      arrayFormat: 'brackets',
    },
  );

  // Create url (include query if GET)
  const query = (method === 'GET' ? `?${stringifiedParams}` : '');
  let url;
  if (!opts.host) {
    // No host included at all. Just send to a path
    url = `${opts.path}${query}`;
  } else {
    url = `https://${opts.host}${opts.path}${query}`;
  }

  // Update headers
  const headers: {
    [k: string]: any,
  } = {};
  let data: string | null | { [k: string]: any } | undefined = null;
  if (!headers['Content-Type']) {
    // Form encoded
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    // Add data if applicable
    data = (method !== 'GET' ? stringifiedParams : null);
  } else {
    // JSON encode
    data = augmentedParams;
  }

  // Encode data
  let encodedData: URLSearchParams | string | undefined;
  if (data) {
    if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      encodedData = new URLSearchParams(augmentedParams);
    } else {
      encodedData = JSON.stringify(data);
    }
  }

  // Send request
  try {
    const response = await fetch(
      url,
      {
        method,
        mode: 'cors',
        headers: headers ?? {},
        body: (
          (method !== 'GET' && encodedData)
            ? encodedData
            : undefined
        ),
        redirect: 'follow',
      },
    );

    // Get headers map
    const responseHeaders: {
      [k in string]: string
    } = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    // Process response based on responseType
    try {
      // Parse response
      let responseBody: any;
      if (
        opts.responseType
        && opts.responseType === 'Text'
      ) {
        // Response type is text
        responseBody = await response.text();
      } else {
        // Response type is JSON
        responseBody = await response.json();
      }

      // Return response
      return {
        body: responseBody,
        status: response.status,
        headers: responseHeaders,
      };
    } catch (err) {
      throw new ErrorWithCode(
        `Failed to parse response as ${opts.responseType}: ${(err as any)?.message}`,
        ExpressKitErrorCode.ResponseParseError,
      );
    }
  } catch (err) {
    // Self-signed certificate error:
    if ((err as any)?.message?.includes('self signed certificate')) {
      throw new ErrorWithCode(
        'We refused to send a request because the receiver has self-signed certificates.',
        ExpressKitErrorCode.SelfSigned,
      );
    }

    // No tries left
    throw new ErrorWithCode(
      `We encountered an error when trying to send a network request. If this issue persists, contact an admin. Error: ${(err as any)?.message}`,
      ExpressKitErrorCode.NotConnected,
    );
  }
};

export default sendServerToServerRequest;
