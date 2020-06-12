import { Injectable } from '@nestjs/common';
import { LogMessageFormat } from 'src/LogMessageFormat';
import { LogType } from 'src/LogType';

@Injectable()
export class LogReceiverService {
  //the type of the log message
  logType: LogType;
  /**
   * Log messages are handled here, meaning their type is identified
   * and they are sent to the respective issue creator component
   * @param logMessage is the log received by the log receiver controller and passed down here to be handled
   */
  handleLogMessage(logMessage: LogMessageFormat) {
    this.logType = logMessage.type;
    switch (this.logType) {
      case LogType.Timeout: {
        //send to timeout issue creating component
        break;
      }
      case LogType.Cpu: {
        //send to cpu utilization issue creating component
        break;
      }
      case LogType.Error: {
        //send to error response issue creating component
        break;
      }
      case LogType.CBOpen: {
        //send to circuit breaker open issue creating component
        break;
      }
    }
  }
}
