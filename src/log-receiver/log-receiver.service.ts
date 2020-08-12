import { Injectable, HttpService } from '@nestjs/common';
import { LogMessageFormat } from 'logging-format';
import { LogType } from 'logging-format';
import { CpuUtilizationIssueCreatorComponent } from '../issue-creator/cpu-issue-creator';
import { TimeoutIssueCreatorComponent } from '../issue-creator/timeout-issue-creator';
import { CbOpenIssueCreatorComponent } from '../issue-creator/cp-open-issue-creator';
import { ErrorResponseIssueCreatorComponent } from '../issue-creator/error-response-issue-ceator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { Logs } from "src/schema/logs.schema";

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
    private http: HttpService,
    @InjectModel('logs') private logModel: Model<Logs>,
  ) {
    // Create an Issue Creator for each LogType
    this.cpuUtilizationIssueCreator = new CpuUtilizationIssueCreatorComponent(http);
    this.timeoutIssueCreator = new TimeoutIssueCreatorComponent(http);
    this.cbOpenIssueCreator = new CbOpenIssueCreatorComponent(http);
    this.errorResponseIssueCreator = new ErrorResponseIssueCreatorComponent(http);
  }

  /**
   * Handling of Log messages
   * @param logMessage is the log received by the log receiver controller
   * This calls the handleLog of the corresponding IssueCreator and passed the log message
   */
  async handleLogMessage(logMessage: LogMessageFormat) {
    let issueID;
    switch (logMessage.type) {
      case LogType.CPU:
        issueID = await this.cpuUtilizationIssueCreator.handleLog(logMessage);
        break;
      case LogType.CB_OPEN:
        issueID = await this.cbOpenIssueCreator.handleLog(logMessage);
        break;
      case LogType.ERROR:
        issueID = await this.errorResponseIssueCreator.handleLog(logMessage);
        break;
      case LogType.TIMEOUT:
        issueID = await this.timeoutIssueCreator.handleLog(logMessage)
        break;
      default:
        throw "Not Implemented LogType"
    }
    return issueID;
  }
  /**
   * Writes the received log message into the database together with the issue ID
   * 
   * @param logMessage Log sent by the monitor
   */
  async addLogMessageToDatabase(logMessage: LogMessageFormat): Promise<Logs> {
    const issueID = await this.handleLogMessage(logMessage);
    const log = {
      time: logMessage.time,
      source: logMessage.source,
      detector: logMessage.detector,
      message: logMessage.message,
      type: logMessage.type,
      data: logMessage.data,
      issueID: issueID
    }
    const addedLog = new this.logModel(log);
    return addedLog.save();
  }
  /**
   * Gets all logs from the database
   */
  async getAllLogs(): Promise<Logs[]> {
    return this.logModel.find().exec();
  }
}
