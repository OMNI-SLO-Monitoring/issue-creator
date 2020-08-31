import { Injectable, HttpService, HttpException } from '@nestjs/common';
import { LogMessageFormat } from 'logging-format';
import { LogType } from 'logging-format';
import { CpuUtilizationIssueCreatorComponent } from '../issue-creator/cpu-issue-creator';
import { TimeoutIssueCreatorComponent } from '../issue-creator/timeout-issue-creator';
import { CbOpenIssueCreatorComponent } from '../issue-creator/cp-open-issue-creator';
import { ErrorResponseIssueCreatorComponent } from '../issue-creator/error-response-issue-creator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logs } from '../schema/logs.schema';
import { ServiceRegistrationService } from '../service-registration/service-registration.service';

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
    private serviceRegistration: ServiceRegistrationService
  ) {
    // Create an Issue Creator for each LogType
    this.cpuUtilizationIssueCreator = new CpuUtilizationIssueCreatorComponent(
      http,
    );
    this.timeoutIssueCreator = new TimeoutIssueCreatorComponent(http);
    this.cbOpenIssueCreator = new CbOpenIssueCreatorComponent(http);
    this.errorResponseIssueCreator = new ErrorResponseIssueCreatorComponent(
      http,
    );
  }

  /**
   * Handling of Log messages
   *
   * @param logMessage is the log received by the log receiver controller
   * This calls the handleLog of the corresponding IssueCreator and passed the log message
   */
  async handleLogMessage(logMessage: LogMessageFormat) {

    if (!logMessage?.detector) {
      throw new HttpException("LogMessage without detector Id", 406);
    } 

    if (!(await this.serviceRegistration.checkIfRegistered(logMessage.detector))) {
      throw new HttpException("LogMessage detector is not registered", 401);
    }

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
        throw 'Not Implemented LogType';
    }

    this.addLogMessageToDatabase(logMessage);
  }
  /**
   * Writes the received log message into the database
   *
   * @param logMessage Log sent by the monitor
   */
  async addLogMessageToDatabase(logMessage: LogMessageFormat): Promise<Logs> {
    const addedLog = new this.logModel(logMessage);
    return addedLog.save();
  }
  /**
   * Gets all logs from the database
   *
   * @returns all logs from the database
   */
  async getAllLogs(): Promise<Logs[]> {
    return this.logModel.find().exec();
  }
  /**
   * Gets all logs from a certain service from the database
   * 
   * @param id id of the service that reported a log
   */
  async getLogsByServiceId(id : any) {
    return this.logModel.find({"detector": id}).exec();
  }
}
