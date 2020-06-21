import { Injectable, Logger, Inject, HttpService } from '@nestjs/common';
import { LogMessageFormat } from 'logging-format';
import { LogType } from 'logging-format';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CpuUtilizationIssueCreatorComponent, TimeoutIssueCreatorComponent, CbOpenIssueCreatorComponent, ErrorResponseIssueCreatorComponent } from 'src/issue-creator/issue-creator-classes';

/**
 * This service handles the log message passed down from the controller
 * and detects the log type as well as sends the log message with the type
 * to the issue assigner service
 */
@Injectable()
export class LogReceiverService {

  cpuUtilizationIssueCreator: CpuUtilizationIssueCreatorComponent;
  timeoutIssueCreator: TimeoutIssueCreatorComponent;
  cbOpenIssueCreator: CbOpenIssueCreatorComponent;
  errorResponseIssueCreator: ErrorResponseIssueCreatorComponent;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private http: HttpService
  ) {
    this.cpuUtilizationIssueCreator = new CpuUtilizationIssueCreatorComponent(http);
    this.timeoutIssueCreator = new TimeoutIssueCreatorComponent(http);
    this.cbOpenIssueCreator = new CbOpenIssueCreatorComponent(http);
    this.errorResponseIssueCreator = new ErrorResponseIssueCreatorComponent(http);

    const testLog = {
      source: "asd",
      target: "asdd",
      time: 23,
      type: LogType.CPU,
      message: "asda"
    };
    this.handleLogMessage(testLog);
  }

  /**
   * Log messages are handled here
   * @param logMessage is the log received by the log receiver controller
   * and passed down here to be handled
   */
  handleLogMessage(logMessage: LogMessageFormat) {
    this.logger.warn(`type: ${logMessage.type} | time: ${logMessage.time} | source: ${logMessage.source} | target: ${logMessage.target} | message: ${logMessage.message}`);
    switch (logMessage.type) {
      case LogType.CPU:
        this.cpuUtilizationIssueCreator.handleLog(logMessage);
        break;
      case LogType.CB_OPEN:
        this.cbOpenIssueCreator.handleLog(logMessage);
        break;
      case LogType.ERROR:
        this.errorResponseIssueCreator.handleLog(logMessage);
        break;
      case LogType.TIMEOUT:
        this.timeoutIssueCreator.handleLog(logMessage);
        break;
      default:
        throw "Not Implemented LogType"
    }
  }
}
