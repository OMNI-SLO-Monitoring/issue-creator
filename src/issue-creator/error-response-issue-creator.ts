import { HttpService } from '@nestjs/common';
import { LogMessageFormat, LogType } from 'logging-format';
import { IssueCreator } from './issue-creator';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Logs } from 'src/schema/logs.schema';

/**
 * ErrorResponseIssueComponent handles ErrorResponse Logs, it extends the IssueCreator to enable individual issue creation for error response issues 
 */
export class ErrorResponseIssueCreatorComponent extends IssueCreator {

  /** If there is an existing log that arrived within this time interval, an incoming issue belongs to the same issue as the existing log  */
  // correspondingIssueTimeInterval: number = 1000 * 60 * 60; // 1 h
  correspondingIssueTimeInterval: number = 1000 * 60 * 60 * 24 * 100; // 100d

  constructor(
    http: HttpService,
    configService: ConfigService,
    private logModel: Model<Logs>,
  ) {
    super(http, configService);
  }

  /**
   * handles error response logs by creating an Issue and sending it to the API: https://github.com/ccims/ccims-backend/tree/apiMockup
   * 
   * @param log received log in the LogMessageFormat
   * @returns the issue ID received from the backend
   */
  async handleLog(log: LogMessageFormat) {
    if (log.type != LogType.ERROR) throw 'Wrong LogType';

    // TODO: Should we include logs with same correlationId for a better stacktrace?
    // TODO: Should we use expected/result as a criterial for when logs belong to an existing issue?
    const query = await this.logModel.find({
      // detector: log.detector, 
      // data: { $gte: log.time - this.correspondingIssueTimeInterval } 
      data: { $gte: 10 } // TODO: Does not work
    });

    console.log(query.length);

    if (query?.length > 0) {
      console.log("Issue exists")
    } else {
      console.log("New Issue");
    }

    // return this.createIssueFromLog(log);
  }
}
