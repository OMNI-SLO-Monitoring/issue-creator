import { Injectable, Logger, Inject } from '@nestjs/common';
import { LogMessageFormat } from 'logging-format';
import { LogType } from 'logging-format';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

/**
 * This service handles the log message passed down from the controller
 * and detects the log type as well as sends the log message with the type
 * to the issue assigner service
 */
@Injectable()
export class LogReceiverService {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}

  //the type of the log message
  logType: LogType;
  /**
   * Log messages are handled here
   * @param logMessage is the log received by the log receiver controller
   * and passed down here to be handled
   */
  handleLogMessage(logMessage: LogMessageFormat) {
    this.logType = logMessage.type;
    this.logger.log(
      'info',
      `type: ${logMessage.type} | time: ${logMessage.time} | source: ${logMessage.source} | target: ${logMessage.target} | message: ${logMessage.message}`,
    );
  }
}
