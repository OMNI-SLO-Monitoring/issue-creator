
import { Injectable, HttpService, HttpException, OnModuleInit } from '@nestjs/common';
import { LogMessageFormat } from 'logging-format';
import { LogType } from 'logging-format';
import { CpuUtilizationIssueCreatorComponent } from '../issue-creator/cpu-issue-creator';
import { TimeoutIssueCreatorComponent } from '../issue-creator/timeout-issue-creator';
import { CbOpenIssueCreatorComponent } from '../issue-creator/cp-open-issue-creator';
import { ErrorResponseIssueCreatorComponent } from '../issue-creator/error-response-issue-creator';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceRegistrationService } from '../service-registration/service-registration.service';
import { Model } from "mongoose";
import { Logs } from "src/schema/logs.schema";
import { ConfigService } from '@nestjs/config';
import { Kafka } from "kafkajs";

/**
 * This service handles the log message passed down from the controller
 * and detects the log type as well as sends the log message with the type
 * to the issue assigner service
 */
@Injectable()

export class LogReceiverService implements OnModuleInit {
  // Issue Creator for the Log Types
  cpuUtilizationIssueCreator: CpuUtilizationIssueCreatorComponent;
  timeoutIssueCreator: TimeoutIssueCreatorComponent;
  cbOpenIssueCreator: CbOpenIssueCreatorComponent;
  errorResponseIssueCreator: ErrorResponseIssueCreatorComponent;
  consumer: any;
  kafka: Kafka;
  kafkaUrl: string;

  constructor(
    private http: HttpService,
    private configService: ConfigService,
    @InjectModel('logs') private logModel: Model<Logs>,
    private serviceRegistration: ServiceRegistrationService
  ) {
    // Create an Issue Creator for each LogType
    this.cpuUtilizationIssueCreator = new CpuUtilizationIssueCreatorComponent(http, configService);
    this.timeoutIssueCreator = new TimeoutIssueCreatorComponent(http, configService);
    this.cbOpenIssueCreator = new CbOpenIssueCreatorComponent(http, configService);
    this.errorResponseIssueCreator = new ErrorResponseIssueCreatorComponent(http, configService);
    this.kafkaUrl = this.configService.get<string>('KAFKA_URL', 'localhost:9092');
    this.kafka = new Kafka({
      clientId: 'issue-creator',
      brokers: [this.kafkaUrl]
      
    }),
    this.consumer = this.kafka.consumer({ groupId: 'my-group '});
  }

  onModuleInit() {
    this.startConsuming();
  }

  /**
   * Handles Log messages by delegating them to the respective IssueCreator
   * 
   * @param logMessage is the log received by the log receiver controller
   * @returns issueID that was received from the backend
   * This calls the handleLog of the corresponding IssueCreator and passed the log message
   * 
   */
  async handleLogMessage(logMessage: LogMessageFormat) {

    if (!logMessage?.detector) {
      throw new HttpException("LogMessage without detector Id", 406);
    } 

    if (!(await this.serviceRegistration.checkIfRegistered(logMessage.detector))) {
      throw new HttpException("LogMessage detector is not registered", 401);
    }

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

    this.addLogMessageToDatabase(logMessage);
    return issueID;
  }
  
  /**
   * Writes the received log message and the issue ID into the database 
   * 
   * @param logMessage Log sent by the monitor
   * @returns the saved log
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
  /**
   * Connecting to kafka instance and begin consuming
   * incoming messages are saved to the collection logs in the mongodb
   * 
   * Consumer is subscribed to the logs topic at the kafka instance
   */
  async startConsuming() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'logs', fromBeginning: true,});

    await this.consumer.run({
      eachMessage: async ({topic, partition, message}) => {
        if (message.value != null) {
          const log: LogMessageFormat = JSON.parse(message.value.toString());
          this.addLogMessageToDatabase(log);
        }
      }
    })
  }
}
