import { IssueReporter } from './issue-reporter';
import { HttpService } from '@nestjs/common';
import { LogMessageFormat } from 'logging-format';
import { IssueFormat } from '../IssueFormat';
import { ConfigService } from '@nestjs/config';
/**
 * generic IssueCreator class, it extends IssueReporter to report issues that were created issues 
 * and it implements the IssueCreatorComponent to handle the incoming logs.
 */
export class IssueCreator extends IssueReporter {
  id: string;
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
      componentIDs: [`${log.detector}`, `${log.source}`],
      labels: [`${log.detector}`],
      assignees: [`${log.detector}`],
      locations: [`${log.source}`],
      startDate: log.time,
      clientMutationID: 'id1234',
    }
    this.id = await this.reportIssue(issue);
    return this.id;
  }
}
