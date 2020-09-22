import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GenericIssueCreator, IGenericIssueCreator } from "src/schema/generic-issue-creator.schema";

@Injectable()
export class GenericIssueCreatorService {

    constructor(
        // @InjectModel('generic-issue-creator') private genericIssueCreatorModel: Model<GenericIssueCreator>
    ) {}

    // async addIssueCreator(creator: IGenericIssueCreator): Promise<GenericIssueCreator> {
    //     const res = await this.genericIssueCreatorModel.create(creator);
    //     console.log(res.id);
    //     return res;
    // }

    // async getIssueCreators() {
    //     return this.genericIssueCreatorModel.find({}).exec();
    // }
}