import { IssueReporter } from "./issue-reporter";
import { IssueCreatorComponent } from "./issue-creator.interface";
import { HttpService } from "@nestjs/common";
import { LogMessageFormat, LogType } from "logging-format";

//  TimeoutIssueComponent handles Timeout Logs, it extends IssueComponent to enable individual issue creation for timeout issues
export class TimeoutIssueCreatorComponent extends IssueReporter implements IssueCreatorComponent {

    constructor(http: HttpService) {
      super(http);
    }
  
    //  handles timeout logs, no specific information on how to handle cpu issues yet
    handleLog(log: LogMessageFormat) {
  
      if (log.type != LogType.TIMEOUT) throw "Wrong LogType";
  
      // TODO: Handle Issue Accordingly
      console.log("Handling Issue");
      this.reportIssue({});
    }
  }