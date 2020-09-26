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
   * creating an Issue from a log and sending that issue to the API: https://github.com/ccims/ccims-backend-gql
   *
   * @param log received log
   * @returns the issue ID received from the backend
   */
  async createIssueFromLog(log: LogMessageFormat): Promise<string> {
    let date = new Date(log.time);
    const issue: IssueFormat = {
      title: `${log.type} at ${log.sourceUrl}`,
      body: JSON.stringify(log.data),
      category: 'BUG',
      componentIDs: [`5d31cb4c619df003`],
      startDate: date,
      clientMutationID: 'Error-Monitoring',
    };
    return this.reportIssue(issue);
  }
  /**
   * handles updating of Issues and checks whether the issue was already created.
   * If it was, the Issue is updated with a comment
   * If it was not, the Issue will be created
   * 
   * @param query the List of logs to be checked
   * @param log received log in the LogMessageFormat
   * @returns the Issue ID either from the database or it receives one from the backend
   */
  async checkForIssueID(query: Logs[], log: LogMessageFormat) {
    const relatedLog = query.find(log => log.issueID);
    if (relatedLog) {
      console.log('FOUND', relatedLog);
      if (!relatedLog.issueID) {
        // Issue already exists but latest log doesn't have a IssueId, this should not happen but if it does we create a new issue anyways
        console.log('WARNING: Log does not have a IssueId');
        return await this.createIssueFromLog(log);
      }
      console.log('Updating Issue with Id');
      return await this.updateLastOccurrence(relatedLog.issueID, log.time);
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
