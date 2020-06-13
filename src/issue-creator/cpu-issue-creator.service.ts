import { Injectable, LogLevel } from '@nestjs/common';
import { LogMessageFormat } from 'src/LogMessageFormat';

/**
 * This component is responsible for receiving the
 * log messages with the corresponding cpu load exceedance type and creating
 * issues from it
 */
@Injectable()
export class CpuIssueCreatorService {
  /**
   * creates the issue from the received log
   */
  createIssueFromLog(logMsg: LogMessageFormat) {}
}
