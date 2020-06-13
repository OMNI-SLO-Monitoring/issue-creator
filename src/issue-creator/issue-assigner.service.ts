import { Injectable } from '@nestjs/common';
import { LogMessageFormat } from 'src/LogMessageFormat';
import { LogType } from 'src/LogType';

/**
 * This service assigns the log messages from the log receiver
 * to the respective issue creating component based on the log type
 */
@Injectable()
export class IssueAssignerService {
  /**
   * takes over the log message from the log receiver
   * and assigns it to respective issue creator component
   * @param logMsg taken from the log receiver
   * @param logType from the log message detected from log receiver
   */
  takeLogAndAssign(logMsg: LogMessageFormat, logType: LogType): void {
    //determines which issue creator component to send the log to
  }
}
