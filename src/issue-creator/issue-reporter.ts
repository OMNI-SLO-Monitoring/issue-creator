import { HttpService } from "@nestjs/common"

/*
  Provides the basic funtionality every "detailed" IssueComponent should have
*/
export abstract class IssueReporter {

    private api = "http://localhost:6969"  // TODO: What API Address

    constructor(private http: HttpService) { }

    /**
      Takes an @param issue and sends Issues to the (not yet implemented) api.
      Can be called in every Component that extends IssueComponent
    */
    // TODO: Create Issue Format (Interface)
    reportIssue(issue: any) {
        console.log("Reporting Issue")
        // TODO: Where/What to send to API
        this.http.post(this.api, issue).subscribe(
            res => console.log("Issue Report Successful!"),
            err => console.log("Error at reporting issue")
        )
    }
}