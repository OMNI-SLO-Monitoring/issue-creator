import { LogMessageFormat } from 'logging-format';
import { LogType } from 'logging-format/src/log-type';

class IssueCreator {
  type: LogType;
  createIssue(logMsg: LogMessageFormat): void {
    //create issue from log message
  }
}

export class CpuIssueCreator extends IssueCreator {
  type = LogType.CPU;
}

export class TimeoutIssueCreator extends IssueCreator {
  type = LogType.TIMEOUT;
}

export class CbOpenIssueCreator extends IssueCreator {
  type = LogType.CB_OPEN;
}

export class ErrorResponseIssueCreator extends IssueCreator {
  type = LogType.ERROR;
}
