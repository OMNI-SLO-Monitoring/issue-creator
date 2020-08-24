import { HttpService } from '@nestjs/common';
import { LogMessageFormat, LogType } from 'logging-format';
import { IssueCreator } from './issue-creator';
import { ConfigService } from '@nestjs/config';

/**
 * CpuUtilizationIssueComponent handles CpuUtilization Logs, it extends IssueCreator to enable individual issue creation for cpu issues
 */
export class CpuUtilizationIssueCreatorComponent extends IssueCreator {
  issueCreator: IssueCreator;
  constructor(http: HttpService, configService: ConfigService) {
    super(http, configService);
    this.issueCreator = new IssueCreator(http, configService);
  }

  /**
   * handles Cpu logs by creating an Issue and sending it to the API: https://github.com/ccims/ccims-backend/tree/apiMockup
   * 
   * @param log received log in the LogMessageFormat
   * @returns the issue ID received from the backend
   */
  async handleLog(log: LogMessageFormat) {
    if (log.type != LogType.CPU) throw 'Wrong LogType';
    return this.issueCreator.createIssueFromLog(log);
  }
}
