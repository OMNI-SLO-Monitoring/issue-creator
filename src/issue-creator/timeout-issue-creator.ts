import { HttpService } from '@nestjs/common';
import { LogMessageFormat, LogType } from 'logging-format';
import { IssueCreator } from './issue-creator'
import { ConfigService } from '@nestjs/config';

/**
 * TimeoutIssueComponent handles Timeout Logs, it extends IssueCreator to enable individual issue creation for timeout issues
 */
export class TimeoutIssueCreatorComponent extends IssueCreator {
  constructor(http: HttpService, configService: ConfigService) {
    super(http, configService);
  }

  /**
   * handles timeout logs by creating an Issue and sending it to the API: https://github.com/ccims/ccims-backend/tree/apiMockup
   *
   * @param log received log in the LogMessageFormat
   * @returns the issue ID received from the backend
   */
  async handleLog(log: LogMessageFormat) {
    if (log.type != LogType.TIMEOUT) throw 'Wrong LogType';
    return this.createIssueFromLog(log);
  }

}
