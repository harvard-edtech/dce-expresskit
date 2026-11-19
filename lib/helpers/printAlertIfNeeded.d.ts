import { Log } from 'dce-commonkit';
/**
 * Print a single-line JSON alert to the console if a log needs the team's
 *   attention. caccl-deploy alarms on any app output line with
 *   "cacclDeployAlert": true and notifies the team (email/Slack).
 *   Only client fatal errors are printed: server failures are already caught
 *   by caccl-deploy's 5xx alarm on the load balancer.
 * @author Yuen Ler Chow
 * @param log the log that was created
 */
declare const printAlertIfNeeded: (log: Log) => void;
export default printAlertIfNeeded;
