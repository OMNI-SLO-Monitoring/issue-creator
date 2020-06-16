import { LogMessageFormat } from 'src/LogMessageFormat';
import { LogType } from 'src/LogType';

class IssueCreator {
  type: LogType;
  createIssue(logMsg: LogMessageFormat): void {
    //create issue from log message
  }
}

export class CpuIssueCreator extends IssueCreator {
  type = LogType.Cpu;
}

export class TimeoutIssueCreator extends IssueCreator {
  type = LogType.Timeout;
}

export class CbOpenIssueCreator extends IssueCreator {
  type = LogType.CBOpen;
}

export class ErrorResponseIssueCreator extends IssueCreator {
  type = LogType.Error;
}
