import { IssueReporter } from './issue-reporter';
import { IssueCreatorComponent } from './issue-creator.interface';
import { HttpService } from '@nestjs/common';
import { LogMessageFormat, LogType } from 'logging-format';
import { IssueFormat } from '../IssueFormat';

//  TimeoutIssueComponent handles Timeout Logs, it extends IssueComponent to enable individual issue creation for timeout issues
export class TimeoutIssueCreatorComponent extends IssueReporter
  implements IssueCreatorComponent {
  id: string;
  constructor(http: HttpService) {
    super(http);
  }

  //  handles timeout logs, no specific information on how to handle cpu issues yet
  async handleLog(log: LogMessageFormat) {
    if (log.type != LogType.TIMEOUT) throw 'Wrong LogType';

    const issue: IssueFormat = {
      title: `${log.type}` ,
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
