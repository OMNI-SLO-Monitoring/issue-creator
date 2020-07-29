import { HttpService } from '@nestjs/common';
import { LogMessageFormat, LogType } from 'logging-format';
import { IssueCreatorComponent } from './issue-creator.interface';
import { IssueReporter } from './issue-reporter';
import { IssueFormat } from '../IssueFormat';

//  CpuUtilizationIssueComponent handles CpuUtilization Logs, it extends IssueComponent to enable individual issue creation for cpu issues
export class CpuUtilizationIssueCreatorComponent extends IssueReporter
  implements IssueCreatorComponent {
  constructor(http: HttpService) {
    super(http);
  }

  //  handles Cpu logs, no specific information on how to handle cpu issues yet
  public handleLog(log: LogMessageFormat) {
    if (log.type != LogType.CPU) throw 'Wrong LogType';

    let issue: IssueFormat = {
      title: `${log.type}`,
      body: `${log.message}`,
      category: 'BUG',
      componentIDs: [`${log.detector}`, `${log.source}`],
      labels: ['ID'],
      assignees: ['ID'],
      locations: ['ID'],
      startDate: log.time,
      clientMutationID: 'id1234',
  }
  
    this.reportIssue(issue);
  }
}
