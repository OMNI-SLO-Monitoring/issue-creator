import { LogMessageFormat, LogType } from 'logging-format';
import { IssueCreator } from './issue-creator';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Logs } from 'src/schema/logs.schema';

/**
 * CbOpenIssueComponent handles CB open Logs, it extends IssueCreator to enable individual issue creation for cb open issues 
 */
export class CbOpenIssueCreatorComponent extends IssueCreator {

  /** If there is an existing log that arrived within this time interval, an incoming issue belongs to the same issue as the existing log  */
  correspondingIssueTimeInterval: number = 1000 * 60 * 60; // 1 h

  constructor(
    private logModel: Model<Logs>,
    configService: ConfigService) {
    super(configService);
  }

  /**
   * handles cb open logs by creating or updating an Issue and sending it to the API: https://github.com/ccims/ccims-backend-gql
   * 
   * @param log received log 
   * @returns the issue ID received from the backend
   */
  async handleLog(log: LogMessageFormat) {
    if (log.type != LogType.CB_OPEN) throw new Error('Wrong LogType');

    const query = await this.logModel.find({
      detectorUrl: log.detectorUrl,
      time: { $gte: log.time - this.correspondingIssueTimeInterval }
    });
    return this.checkForIssueID(query, log);
  }
}
