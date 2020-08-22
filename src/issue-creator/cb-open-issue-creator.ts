import { IssueReporter } from './issue-reporter';
import { IssueCreatorComponent } from './issue-creator.interface';
import { HttpService } from '@nestjs/common';
import { LogMessageFormat, LogType } from 'logging-format';
import { IssueFormat } from '../IssueFormat';
/**
 * CbOpenIssueComponent handles Timeout Logs, it extends IssueComponent to enable individual issue creation for cb open issues
 */
export class CbOpenIssueCreatorComponent extends IssueReporter
  implements IssueCreatorComponent {
  id: string;
  constructor(http: HttpService) {
    super(http);
  }

   /**
   * handles cp open logs, no specific information on how to handle cpu issues yet
   * @param log received log in the LogMessageFormat
   * @returns the issue ID received from the Back end
   */
  async handleLog(log: LogMessageFormat) {
    if (log.type != LogType.CB_OPEN) throw 'Wrong LogType';

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
