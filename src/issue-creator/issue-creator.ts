import { IssueReporter } from './issue-reporter';
import { HttpService } from '@nestjs/common';
import { LogMessageFormat } from 'logging-format';
import { IssueFormat } from '../IssueFormat';
import { ConfigService } from '@nestjs/config';
/**
 * generic IssueCreator class. It extends IssueReporter to report issues that were created.
 * It implements the IssueCreatorComponent to handle the incoming logs.
 */
export abstract class IssueCreator extends IssueReporter {

  constructor(http: HttpService, configService: ConfigService) {
    super(http, configService);
  }

  /**
   * creating an Issue from a log and sending that issue to the API: https://github.com/ccims/ccims-backend/tree/apiMockup
   *
   * @param log received log
   * @returns the issue ID received from the backend
   */
  async createIssueFromLog(log: LogMessageFormat) {
    const issue: IssueFormat = {
      title: `${log.type}`,
      body: `${log.data}`,
      category: 'BUG',
      componentIDs: [`${log.detectorUrl}`, `${log.sourceUrl}`],
      labels: [`${log.detectorUrl}`],
      assignees: [`${log.detectorUrl}`],
      locations: [`${log.sourceUrl}`],
      startDate: log.time,
      clientMutationID: 'id1234',
    };
    return this.reportIssue(issue);
  }

  /**
   * basic functionality to handle logs that every IssueCreator should have
   *
   * @param log incoming Log
   */
  abstract handleLog(log: LogMessageFormat);
}
