import { IssueReporter } from './issue-reporter';
import { LogMessageFormat } from 'logging-format';
import { IssueFormat } from '../IssueFormat';
import { ConfigService } from '@nestjs/config';
import { Logs } from 'src/schema/logs.schema';
/**
 * generic IssueCreator class. It extends IssueReporter to report issues that were created.
 * It implements the IssueCreatorComponent to handle the incoming logs.
 */
export abstract class IssueCreator extends IssueReporter {

  constructor(configService: ConfigService) {
    super(configService);
  }

  /**
   * creating an Issue from a log and sending that issue to the API: https://github.com/ccims/ccims-backend/tree/apiMockup
   *
   * @param log received log
   * @returns the issue ID received from the backend
   */
  async createIssueFromLog(log: LogMessageFormat) {
    const issue: IssueFormat = {
      title: `${log.type} + Error at ${log.sourceUrl}` ,
      body: JSON.stringify(log.data),
      category: 'BUG',
      componentIDs: [`5d31793fbdabf003`],
      startDate: log.time,
      clientMutationID: 'Error-Monitoring',
    };
    return this.reportIssue(issue);
  }

  async checkIssueID(query: Logs[], log: LogMessageFormat){
    const relatedLog = query.find(log => log.issueID);
    if (relatedLog) {
      console.log('FOUND', relatedLog);
      if (!relatedLog.issueID) {
        // Issue already exists but latest log doesn't have a IssueId, this should not happen but if it does we create a new issue anyways
        console.log('WARNING: Log does not have a IssueId');
        return await this.createIssueFromLog(log);
      }
      console.log('Updating Issue with Id');
      return  await this.updateLastOccurrence(relatedLog.issueID, log.time); 
    } else {
      console.log('Issue does not exist yet');
      return await this.createIssueFromLog(log);
    }
  }
  /**
   * basic functionality to handle logs that every IssueCreator should have
   *
   * @param log incoming Log
   */
  abstract handleLog(log: LogMessageFormat);
}
