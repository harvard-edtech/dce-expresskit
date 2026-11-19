// Import dce-commonkit
import { Log, LogType, LogSource } from 'dce-commonkit';

// Import shared constants
import ALARM_LOG_TAG from '../constants/ALARM_LOG_TAG';

// Max length of the error message to include
const MAX_MESSAGE_LENGTH = 300;

/**
 * Print a single-line JSON alert to the console if a log was tagged with
 *   ALARM_LOG_TAG. caccl-deploy alarms on any app output line with
 *   "cacclDeployAlert": true and notifies the team (email/Slack).
 *   Alerts are opt-in: untagged logs never print (server 5xx responses are
 *   already caught by caccl-deploy's 5xx alarm on the load balancer)
 * @author Yuen Ler Chow
 * @param log the log that was created
 */
const printAlertIfNeeded = (log: Log) => {
  try {
    if (!Array.isArray(log.tags) || !log.tags.includes(ALARM_LOG_TAG)) {
      return;
    }

    // eslint-disable-next-line no-console
    console.error(JSON.stringify({
      cacclDeployAlert: true,
      source: log.source,
      context: log.context,
      subcontext: log.subcontext,
      ...(
        log.type === LogType.Error
          ? {
            errorCode: log.errorCode,
            errorMessage: String(log.errorMessage).substring(0, MAX_MESSAGE_LENGTH),
          }
          : {}
      ),
      ...(
        log.source === LogSource.Server
          ? { route: log.routeTemplate }
          : {}
      ),
      logId: log.id,
      courseId: log.courseId,
      userId: log.userId,
    }));
  } catch (err) {
    // Never let alerting break logging
  }
};

export default printAlertIfNeeded;
