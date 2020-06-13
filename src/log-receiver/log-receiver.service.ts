import { Injectable } from '@nestjs/common';
import { LogMessageFormat } from 'src/LogMessageFormat';
import { LogType } from 'src/LogType';
import { IssueAssignerService } from 'src/issue-creator/issue-assigner.service';

/**
 * This service handles the log message passed down from the controller
 * and detects the log type as well as sends the log message with the type
 * to the issue assigner service
 */
@Injectable()
export class LogReceiverService {
  constructor(private issueAssigner: IssueAssignerService) {}

  //the type of the log message
  logType: LogType;
  /**
   * Log messages are handled here, meaning their type is identified
   * and they are sent to the issue assigner
   * @param logMessage is the log received by the log receiver controller
   * and passed down here to be handled
   */
  handleLogMessage(logMessage: LogMessageFormat) {
    this.logType = logMessage.type;
    this.issueAssigner.takeLogAndAssign(logMessage, this.logType);
  }
}
