import {
  Injectable,
  HttpException,
  OnModuleInit,
} from '@nestjs/common';
import { LogMessageFormat } from 'logging-format';
import { LogType } from 'logging-format';
import { CpuUtilizationIssueCreatorComponent } from '../issue-creator/cpu-issue-creator';
import { TimeoutIssueCreatorComponent } from '../issue-creator/timeout-issue-creator';
import { CbOpenIssueCreatorComponent } from '../issue-creator/cb-open-issue-creator';
import { ErrorResponseIssueCreatorComponent } from '../issue-creator/error-response-issue-creator';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceRegistrationService } from '../service-registration/service-registration.service';
import { Model } from 'mongoose';
import { Logs } from 'src/schema/logs.schema';
import { ConfigService } from '@nestjs/config';
import { Kafka } from 'kafkajs';
import { request } from 'graphql-request';

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
  api = this.configService.get<string>('BACKEND_API');

  constructor(
    private configService: ConfigService,
    @InjectModel('logs') private logModel: Model<Logs>,
    private serviceRegistration: ServiceRegistrationService,
  ) {
    this.initIssueCreators();
    this.initKafka()
  }
  /**
   * Create an Issue Creator for each LogType
   */
  initIssueCreators() {
    this.cpuUtilizationIssueCreator = new CpuUtilizationIssueCreatorComponent(
      this.logModel,
      this.configService,
    );
    this.timeoutIssueCreator = new TimeoutIssueCreatorComponent(
      this.logModel,
      this.configService,
    );
    this.cbOpenIssueCreator = new CbOpenIssueCreatorComponent(
      this.logModel,
      this.configService,
    );
    this.errorResponseIssueCreator = new ErrorResponseIssueCreatorComponent(
      this.logModel,
      this.configService,
    );
  }
  /**
   * Initiating the Kafka queue 
   */
  initKafka() {
    this.kafkaUrl = this.configService.get<string>(
      'KAFKA_URL',
      'localhost:9092',
    );
    (this.kafka = new Kafka({
      clientId: 'issue-creator',
      brokers: [this.kafkaUrl],
    })),
      (this.consumer = this.kafka.consumer({ groupId: 'my-group ' }));
  }

  onModuleInit() {
    this.startConsuming();
  }

  /**
   * This function probes whether or not the service with the given service url is already registered.
   * Firstly, the format of the provided url is checked and based on it, two evaluations take place. One searches
   * in the database for the corresponding service url without the "/" and one with. If a search is successful,
   * the service url will be altered if the "/" is missing and remains unaltered when the service url format is
   * conformed.
   *
   * @param detectorUrl the provided service url with which to search the corresponding service in the database
   * @returns true if service is registered and false otherwise
   */
  async evaluatingUrl(log: LogMessageFormat) {
    if (log.detectorUrl.endsWith('/')) {
      if (await this.serviceRegistration.checkIfRegistered(log.detectorUrl)) {
        return true;
      }
    } else {
      if (
        await this.serviceRegistration.checkIfRegistered(log.detectorUrl + '/')
      ) {
        log.detectorUrl = log.detectorUrl + '/';
        return true;
      }
    }
    return false;
  }

  /**
     * Handles Log messages and saves the Log in the database with the Issue Id
     * checks if the Detector is registered or whether the LogMessage has a detector Id
     *
     * @param logMessage is the log received by the log receiver controller
     * @returns issueID that was received from the backend
     *
     */
  async handleLogMessage(logMessage: LogMessageFormat) {
    console.log('processing: ', logMessage);
    if (!logMessage?.detectorUrl) {
      throw new HttpException('LogMessage without detector Id', 406);
    }
    if (!(await this.evaluatingUrl(logMessage))) {
      throw new HttpException('LogMessage detector is not registered', 401);
    } else {
      console.log('Detector is registered');
    }
    const issueID: string = await this.chooseIssueCreator(logMessage);
    console.log("Saving Log: " + JSON.stringify(logMessage));
    this.addLogMessageToDatabase(logMessage, issueID);
    return issueID;
  }

  /**
   * Handles Log messages by delegating them to the respective IssueCreator 
   * saves the Issue Id received from the backend
   *
   * @param logMessage is the log received by the log receiver controller
   * @returns issueID that was received from the backend
   * This calls the handleLog of the corresponding IssueCreator and passed the log message
   *
   */
  async chooseIssueCreator(logMessage: LogMessageFormat) {
    let issueID: string;
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
        issueID = await this.timeoutIssueCreator.handleLog(logMessage);
        break;
      default:
        throw new Error('Not Implemented LogType');
    }
    return issueID;
  }
  /**
   * Writes the received log message and the issue ID into the database
   *
   * @param logMessage Log sent by the monitor
   * @returns the saved log
   */
  async addLogMessageToDatabase(
    logMessage: LogMessageFormat,
    issueID: string,
  ): Promise<Logs> {
    const log = {
      time: logMessage.time,
      sourceUrl: logMessage.sourceUrl,
      detectorUrl: logMessage.detectorUrl,
      message: logMessage.message,
      type: logMessage.type,
      data: logMessage.data,
      issueID: issueID,
    };
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
   * Deletes all logs from DB.
   * 
   * @returns LogModel object whether it was successful  and  how many entries were deleted. 
   */
  async deleteAllLogs() {
    return this.logModel.deleteMany({ time: { $gte: 0 } }).exec();
  }

  /**
   * Gets all logs from a certain service from the database
   *
   * @param id id of the service that reported a log
   *
   * @returns array of logs where detectorUrl matches url of service corresponding to serviceId
   */
  async getLogsByServiceId(id: any) {
    const service = await this.serviceRegistration.getService(id);
    return this.logModel.find({ detectorUrl: service.serviceUrl }).exec();
  }
  /**
   * Connecting to kafka instance and begin consuming
   * incoming messages are saved to the collection logs in the mongodb
   *
   * Consumer is subscribed to the logs topic at the kafka instance
   */
  async startConsuming() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'logs', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (message.value != null) {
          const log: LogMessageFormat = JSON.parse(message.value.toString());
          await this.handleLogMessage(log);
        }
      },
    });
  }

  async stopConsuming() {
    await this.consumer.disconnect();
  }
  /**
   * sends an issue id to the Backend API to request the corresponding issue 
   * 
   * @param issueID of an issue
   * @returns the issue corresponding to the issue id
   */
  async getIssueFromID(issueID: string) {
    const queryIssue = `
      query getIssue{
        node (id : "${issueID}"){...on Issue{
          id, 
          title, 
          body, 
          category, 
          issueComments{
            nodes{
              body
            }
          }
          isOpen
          }
        }
      }
      `;
    try {
      const data = await request(`${this.api}`, queryIssue);
      const issue = { "issue": data.node }
      return issue;
    } catch (error) {
      throw new Error(error);
    }
  }
}
