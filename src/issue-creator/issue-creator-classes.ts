import { LogMessageFormat } from 'logging-format';
import { LogType } from 'logging-format';
import { HttpService } from '@nestjs/common';

interface IssueCreatorComponent {
  handleLog(log: LogMessageFormat);
}

/*
  Provides the basic funtionality every "detailed" IssiueComponent should have
*/
abstract class IssueReporter {

  private api = "http://localhost:6969"  // TODO: What API Address
  
  // log: LogMessageFormat;

  constructor(private http: HttpService) {}

  /*
    handles the recieved log, will be extended in every component that extends IssueComponent
  */
  protected handleIssue(log: LogMessageFormat) {}

  /*
    Creates and sends Issues to (not yet implemented) api.
    Can be called in every Component that extends IssueComponent
  */
 // TODO: Create Issue Format (Interface)
  reportIssue(issue: any) {
    // Send to API
    console.log("Reporting Issue")
    // TODO: Where/What to send to API
    this.http.post(this.api, issue).subscribe(
      res => console.log("Issue Report Successful!"),
      err => console.log("Error at reporting issue")
    )
  }
}

/*
  CpuUtilizationIssueComponent handles CpuUtilization Logs, it extends IssueComponent to enable individual issue creation for cpu issues
*/
export class CpuUtilizationIssueCreatorComponent extends IssueReporter implements IssueCreatorComponent {

  constructor(http: HttpService) {
    super(http);
  }

  /*
    handles Cpu logs, no specific information on how to handle cpu issues yet
  */
  public handleLog(log: LogMessageFormat) {
    // TODO: Handle Issue Accordingly
    this.reportIssue({
      type: "CPU",
      cpuLoad: 23   // TODO: extract from logMessageFormat
    });
  }
}

/*
  TimeoutIssueComponent handles Timeout Logs, it extends IssueComponent to enable individual issue creation for timeout issues
*/
export class TimeoutIssueCreatorComponent extends IssueReporter implements IssueCreatorComponent {
  type = LogType.TIMEOUT;

  constructor(http: HttpService) {
    super(http);
  }

  /*
    handles timeout logs, no specific information on how to handle cpu issues yet
  */
  handleLog(log: LogMessageFormat) {
    // TODO: Handle Issue Accordingly
    console.log("Handling Issue");
    this.reportIssue({});
  }
}

/*
  CbOpenIssueComponent handles Timeout Logs, it extends IssueComponent to enable individual issue creation for cb open issues
*/
export class CbOpenIssueCreatorComponent extends IssueReporter implements IssueCreatorComponent {
  type = LogType.CB_OPEN;

  constructor(http: HttpService) {
    super(http);
  }

  /*
    handles cp open logs, no specific information on how to handle cpu issues yet
  */
  handleLog(log: LogMessageFormat) {
    // TODO: Handle Issue Accordingly
    console.log("Handling Issue");
    this.reportIssue({});
  }
}

/*
  ErrorResponseIssueComponent handles Timeout Logs, it extends IssueComponent to enable individual issue creation for error response issues
*/
export class ErrorResponseIssueCreatorComponent extends IssueReporter implements IssueCreatorComponent {
  type = LogType.ERROR;

  constructor(http: HttpService) {
    super(http);
  }

  /*
    handles error response logs, no specific information on how to handle cpu issues yet
  */
  handleLog(log: LogMessageFormat) {
    // TODO: Handle Issue Accordingly
    console.log("Handling Issue");
    this.reportIssue({});
  }
}
