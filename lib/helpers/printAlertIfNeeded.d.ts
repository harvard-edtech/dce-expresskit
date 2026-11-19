import { Log } from 'dce-commonkit';
/**
 * Print a single-line JSON alert to the console if a log was tagged with
 *   ALARM_LOG_TAG. caccl-deploy alarms on any app output line with
 *   "cacclDeployAlert": true and notifies the team (email/Slack).
 *   Alerts are opt-in: untagged logs never print (server 5xx responses are
 *   already caught by caccl-deploy's 5xx alarm on the load balancer)
 * @author Yuen Ler Chow
 * @param log the log that was created
 */
declare const printAlertIfNeeded: (log: Log) => void;
export default printAlertIfNeeded;
