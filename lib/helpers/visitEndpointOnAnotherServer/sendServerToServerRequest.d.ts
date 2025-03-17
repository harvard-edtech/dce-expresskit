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
declare const sendServerToServerRequest: (opts: {
    path: string;
    host?: string;
    method?: ("GET" | "POST" | "PUT" | "DELETE");
    params?: { [k in string]: any; };
    responseType?: "Text" | "JSON";
}) => Promise<{
    body: any;
    status: number;
    headers: { [k in string]: any; };
}>;
export default sendServerToServerRequest;
