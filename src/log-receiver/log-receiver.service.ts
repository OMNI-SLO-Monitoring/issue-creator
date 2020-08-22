import { Injectable, Logger, Inject, HttpService, OnModuleInit } from '@nestjs/common';
import { LogMessageFormat } from 'logging-format';
import { LogType } from 'logging-format';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CpuUtilizationIssueCreatorComponent } from '../issue-creator/cpu-issue-creator';
import { TimeoutIssueCreatorComponent } from '../issue-creator/timeout-issue-creator';
import { CbOpenIssueCreatorComponent } from '../issue-creator/cp-open-issue-creator';
import { ErrorResponseIssueCreatorComponent } from '../issue-creator/error-response-issue-creator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { Logs } from "src/schema/logs.schema";
const {Kafka} = require('kafkajs');
const kafka = new Kafka({
  clientId: 'issue-creator',
  brokers: ['localhost:9092']
});
const consumer = kafka.consumer({ groupId: 'my-group '});

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

  constructor(
    private http: HttpService,
    @InjectModel('logs') private logModel: Model<Logs>,
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
  onModuleInit() {
    this.startConsuming();
  }

  /**
   * Handling of Log messages
   *
   * @param logMessage is the log received by the log receiver controller
   * This calls the handleLog of the corresponding IssueCreator and passed the log message
   */
  handleLogMessage(logMessage: LogMessageFormat) {
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
    return this.logModel.find({"serviceId": id}).exec();
  }
  /**
   * Connecting to kafka instance and begin consuming
   * incoming messages are saved to the collection logs in the mongodb
   * 
   * Consumer is subscribed to the logs topic at the kafka instance
   */
  async startConsuming() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'logs', fromBeginning: true,});

    await consumer.run({
      eachMessage: async ({topic, partition, message}) => {
        if (message.value != null) {
          let log: LogMessageFormat = JSON.parse(message.value.toString());
          this.addLogMessageToDatabase(log);
        }
      }
    })
  }
}
