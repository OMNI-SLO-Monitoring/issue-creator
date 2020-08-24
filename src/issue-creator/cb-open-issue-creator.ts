import { HttpService } from '@nestjs/common';
import { LogMessageFormat, LogType } from 'logging-format';
import { IssueCreator } from './issue-creator';
import { ConfigService } from '@nestjs/config';

/**
 * CbOpenIssueComponent handles CB open Logs, it extends IssueCreator to enable individual issue creation for cb open issues 
 */
export class CbOpenIssueCreatorComponent extends IssueCreator {
  issueCreator: IssueCreator;
  constructor(http: HttpService, configService: ConfigService) {
    super(http, configService);
    this.issueCreator = new IssueCreator(http, configService);
  }

  /**
   * handles cp open logs by creating an Issue and sending it to the API: https://github.com/ccims/ccims-backend/tree/apiMockup
   * 
   * @param log received log 
   * @returns the issue ID received from the backend
   */
  async handleLog(log: LogMessageFormat) {
    if (log.type != LogType.CB_OPEN) throw 'Wrong LogType';
    return this.issueCreator.createIssueFromLog(log);
  }
}
