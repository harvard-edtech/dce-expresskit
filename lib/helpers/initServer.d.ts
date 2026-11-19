import express from 'express';
import { ErrorNotifierOpts } from './errorNotifier';
/**
 * Prepare dce-commonkit to run on the server
 * @author Gabe Abrams
 * @param opts object containing all arguments
 * @param opts.app express app from inside of the postprocessor function that
 *   we will add routes to
 * @param [opts.errorNotifier] if included, the app is notified about errors
 *   that need attention: server errors (except ones that sent the user a 4xx)
 *   and client fatal errors
 */
declare const initServer: (opts: {
    app: express.Application;
    errorNotifier?: ErrorNotifierOpts;
}) => void;
export default initServer;
