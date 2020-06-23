import { Injectable, Logger, Inject, HttpService } from '@nestjs/common';
import { LogMessageFormat } from 'logging-format';
import { LogType } from 'logging-format';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CpuUtilizationIssueCreatorComponent } from 'src/issue-creator/cpu-issue-creator';
import { TimeoutIssueCreatorComponent } from 'src/issue-creator/timeout-issue-creator';
import { CbOpenIssueCreatorComponent } from 'src/issue-creator/cp-open-issue-creator';
import { ErrorResponseIssueCreatorComponent } from 'src/issue-creator/error-response-issue-ceator';

/**
 * This service handles the log message passed down from the controller
 * and detects the log type as well as sends the log message with the type
 * to the issue assigner service
 */
@Injectable()
export class LogReceiverService {

  // Issue Creator for the Log Types
  cpuUtilizationIssueCreator: CpuUtilizationIssueCreatorComponent;
  timeoutIssueCreator: TimeoutIssueCreatorComponent;
  cbOpenIssueCreator: CbOpenIssueCreatorComponent;
  errorResponseIssueCreator: ErrorResponseIssueCreatorComponent;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private http: HttpService
  ) {
    // Create an Issue Creator for each LogType
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
   * Handling of Log messages
   * @param logMessage is the log received by the log receiver controller
   * This calls the handleLog of the corresponding IssueCreator and passed the log message
   */
  handleLogMessage(logMessage: LogMessageFormat) {
    // logging with winstaond
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
