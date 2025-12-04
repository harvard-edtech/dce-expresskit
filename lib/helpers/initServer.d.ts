import express from 'express';
/**
 * Prepare dce-commonkit to run on the server
 * @author Gabe Abrams
 * @param opts object containing all arguments
 * @param opts.app express app from inside of the postprocessor function that
 *   we will add routes to
 */
declare const initServer: (opts: {
    app: express.Application;
}) => void;
export default initServer;
