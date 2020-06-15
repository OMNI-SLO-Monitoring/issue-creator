import { Injectable } from '@nestjs/common';
import { LogMessageFormat } from 'src/LogMessageFormat';
import { LogType } from 'src/LogType';
import { CpuIssueCreatorService } from './cpu-issue-creator.service';
import { ErrorResponseIssueCreatorService } from './error-response-issue-creator.service';
import { TimeoutIssueCreatorService } from './timeout-issue-creator.service';
import { CbOpenIssueCreatorService } from './cb-open-issue-creator.service';

/**
 * This service assigns the log messages from the log receiver
 * to the respective issue creating component based on the log type
 */
@Injectable()
export class IssueAssignerService {
  constructor(
    private cpuIssueCreator: CpuIssueCreatorService,
    private errorIssueCreator: ErrorResponseIssueCreatorService,
    private timeoutIssueCreator: TimeoutIssueCreatorService,
    private cbIssueCreator: CbOpenIssueCreatorService,
  ) {}
  /**
   * takes over the log message from the log receiver
   * and assigns it to respective issue creator component
   * @param logMsg taken from the log receiver
   * @param logType from the log message detected from log receiver
   */
  takeLogAndAssign(logMsg: LogMessageFormat, logType: LogType): void {
    //determines which issue creator component to send the log to
    //note, this is just a placeholder for future, improved implementations
    switch (logType) {
      case LogType.Cpu: {
        this.cpuIssueCreator.createIssueFromLog(logMsg);
      }
      case LogType.Error: {
        this.errorIssueCreator.createIssueFromLog(logMsg);
      }
      case LogType.Timeout: {
        this.timeoutIssueCreator.createIssueFromLog(logMsg);
      }
      case LogType.CBOpen: {
        this.cbIssueCreator.createIssueFromLog(logMsg);
      }
    }
  }
}
