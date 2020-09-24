import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { IssueCreator } from "src/issue-creator/issue-creator";
import { IGenericIssueCreator } from "src/schema/generic-issue-creator.schema";
import { GenericIssueCreatorService } from "./generic-issue-creator.service";

@Controller('generic-issue-creator')
export class GenericIssueCreatorController {

    constructor(private genericIssueCreatorService: GenericIssueCreatorService) {}

    @Get("/all")
    getGenericIssueCreators() {
        return this.genericIssueCreatorService.getIssueCreators();
    }

    @Post()
    addGenericIssueCreator(@Body() issueCreator: IGenericIssueCreator) {
        return this.genericIssueCreatorService.addIssueCreator(issueCreator);
    }

    @Post("/edit")
    editGenericIssueCreator(@Param() params, @Body() issueCreator: IGenericIssueCreator) {
        return this.genericIssueCreatorService.editIssueCreator(issueCreator);
    }

    @Get("/:id")
    getGenericIssueCreator(@Param() params) {
        return this.genericIssueCreatorService.getIssueCreator(params.id);
    }
}