import { HttpService } from '@nestjs/common';
import { LogMessageFormat, LogType } from 'logging-format';
import { IssueCreator } from './issue-creator'
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Logs } from 'src/schema/logs.schema';

/**
 * TimeoutIssueComponent handles Timeout Logs, it extends IssueCreator to enable individual issue creation for timeout issues
 */
export class TimeoutIssueCreatorComponent extends IssueCreator {

  /** If there is an existing log that arrived within this time interval, an incoming issue belongs to the same issue as the existing log  */
  correspondingIssueTimeInterval: number = 1000 * 60 * 60; // 1 h

  constructor(
    http: HttpService,
    private logModel: Model<Logs>,
    configService: ConfigService) {
    super(http, configService);
  }

  /**
   * handles timeout logs by creating or updating an Issue and sending it to the API: https://github.com/ccims/ccims-backend/tree/apiMockup
   *
   * @param log received log in the LogMessageFormat
   * @returns the issue ID received from the backend
   */
  async handleLog(log: LogMessageFormat) {
    if (log.type != LogType.TIMEOUT) throw 'Wrong LogType';

    // TODO: Should we include logs with same correlationId for a better stacktrace?
    const query = await this.logModel.find({
      detectorUrl: log.detectorUrl,
      time: { $gte: log.time - this.correspondingIssueTimeInterval }
    });

    const relatedLog = query.find((log) => log.issueID)

    if (relatedLog) {

      if (!relatedLog.issueID) {
        // Issue already exists but latest log doesn't have a IssueId, this should not happen but if it does we create a new issue anyways
        console.log("WARNING: Log does not have a IssueId")
        return await this.createIssueFromLog(log);
      }
      console.log("Updating Issue with Id ")
      return await this.updateLastOccurrence(relatedLog.issueID, log.time) // TODO: ? Should we add more information to the commend besides time?

    } else {
      console.log("Issue does not exist yet");
      return await this.createIssueFromLog(log);
    }
  }

}
