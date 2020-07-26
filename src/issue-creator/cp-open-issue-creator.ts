import { IssueReporter } from './issue-reporter';
import { IssueCreatorComponent } from './issue-creator.interface';
import { HttpService } from '@nestjs/common';
import { LogMessageFormat, LogType } from 'logging-format';
import { IssueFormat } from '../IssueFormat';

// CbOpenIssueComponent handles Timeout Logs, it extends IssueComponent to enable individual issue creation for cb open issues
export class CbOpenIssueCreatorComponent extends IssueReporter
  implements IssueCreatorComponent {
  constructor(http: HttpService) {
    super(http);
  }

  // handles cp open logs, no specific information on how to handle cpu issues yet
  handleLog(log: LogMessageFormat) {
    if (log.type != LogType.CB_OPEN) throw 'Wrong LogType';

    // TODO: Handle Issue Accordingly
    console.log('Handling Issue');
    this.reportIssue({});
  }
}
