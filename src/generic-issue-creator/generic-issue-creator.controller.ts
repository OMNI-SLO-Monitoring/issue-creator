import { Body, Controller, Get, Post } from "@nestjs/common";
import { IssueCreator } from "src/issue-creator/issue-creator";
import { IGenericIssueCreator } from "src/schema/generic-issue-creator.schema";
import { GenericIssueCreatorService } from "./generic-issue-creator.service";

@Controller('generic-issue-creator')
export class GenericIssueCreatorController {

    // constructor(private genericIssueCreatorService: GenericIssueCreatorService) {}

    @Get("/test")
    getGenericIssueCreators() {
        console.log("asdasdad");
        return "ja";
        // return this.genericIssueCreatorService.getIssueCreators();
    }

    // @Post()
    // addGenericIssueCreator(@Body() issueCreator: IGenericIssueCreator) {
    //     // return this.genericIssueCreatorService.addIssueCreator(issueCreator);
    // }
}