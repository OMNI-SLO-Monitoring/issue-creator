import { IssueReporter } from './issue-reporter';
import { IssueCreatorComponent } from './issue-creator.interface';
import { HttpService } from '@nestjs/common';
import { LogMessageFormat, LogType } from 'logging-format';
import { IssueFormat } from '../IssueFormat';

// ErrorResponseIssueComponent handles Timeout Logs, it extends IssueComponent to enable individual issue creation for error response issues
export class ErrorResponseIssueCreatorComponent extends IssueReporter
  implements IssueCreatorComponent {
  constructor(http: HttpService) {
    super(http);
  }

  //  handles error response logs, no specific information on how to handle cpu issues yet
  handleLog(log: LogMessageFormat) {
    if (log.type != LogType.ERROR) throw 'Wrong LogType';

    const issue: IssueFormat = {
      title: `${log.type}`,
      body: `${log.message}`,
      category: 'BUG',
      componentIDs: [`${log.detector}`, `${log.source}`],
      labels: [`${log.detector}`],
      assignees: [`${log.detector}`],
      locations: [`${log.source}`],
      startDate: log.time,
      clientMutationID: 'id1234',
  }

    this.reportIssue(issue);
  }
}
