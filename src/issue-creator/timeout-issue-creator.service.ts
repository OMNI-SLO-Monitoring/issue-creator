import { Injectable } from '@nestjs/common';
import { LogMessageFormat } from 'src/LogMessageFormat';

/**
 * This component is responsible for receiving the
 * log messages with the corresponding timeout type and creating
 * issues from it
 */
@Injectable()
export class TimeoutIssueCreatorService {
  /**
   * creates the issue from the received log
   */
  createIssueFromLog(logMsg: LogMessageFormat) {}
}
