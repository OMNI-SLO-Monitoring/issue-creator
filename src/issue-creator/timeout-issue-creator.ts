import { IssueReporter } from './issue-reporter';
import { IssueCreatorComponent } from './issue-creator.interface';
import { HttpService } from '@nestjs/common';
import { LogMessageFormat, LogType } from 'logging-format';
import { IssueFormat } from '../IssueFormat';

//  TimeoutIssueComponent handles Timeout Logs, it extends IssueComponent to enable individual issue creation for timeout issues
export class TimeoutIssueCreatorComponent extends IssueReporter
  implements IssueCreatorComponent {
  constructor(http: HttpService) {
    super(http);
  }

  //  handles timeout logs, no specific information on how to handle cpu issues yet
  handleLog(log: LogMessageFormat) {
    if (log.type != LogType.TIMEOUT) throw 'Wrong LogType';


    const issue: IssueFormat = {
      title: `${log.type}` + 'error',
      body: `${log.message}`,
      category: 'BUG',
      componentIDs: [`${log.detector}`, `${log.source}`],
      labels: [`${log.detector}`],
      assignees: [`${log.detector}`],
      locations: [`${log.source}`],
      startDate: log.time,
      clientMutationID: 'id1234',
    }
    console.log('Hallo');
    this.reportIssue(issue);
  }
  

}
