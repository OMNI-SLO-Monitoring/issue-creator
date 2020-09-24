import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { LogMessageFormat } from "logging-format";
import { Model } from "mongoose";
import { GenericIssueCreator, IGenericIssueCreator } from "src/schema/generic-issue-creator.schema";
import { Logs } from "src/schema/logs.schema";

@Injectable()
export class GenericIssueCreatorService {

    private issueCreators: { [id: string]: GenericIssueCreator } = {};

    constructor(
        @InjectModel('generic-issue-creator') private genericIssueCreatorModel: Model<GenericIssueCreator>
    ) {
        this.getIssueCreators().then(res => res.forEach(creator => this.issueCreators[creator.id] = creator));
    }

    async addIssueCreator(creator: IGenericIssueCreator): Promise<GenericIssueCreator> {
        const res = await this.genericIssueCreatorModel.create(creator);
        this.issueCreators[res.id] = res;
        return res;
    }

    async editIssueCreator(creator: IGenericIssueCreator): Promise<GenericIssueCreator> {
        if (!creator._id) {
            return;
        }
        const res = await this.genericIssueCreatorModel.update({ _id: creator._id}, creator)
        this.issueCreators[creator._id] = res;
        return res;
    }

    async getIssueCreators() {
        return this.genericIssueCreatorModel.find({}).exec();
    }

    async getIssueCreator(id) {
        return this.genericIssueCreatorModel.findById(id);
    }

    handleLog(log: Logs) {
        Object.values(this.issueCreators).forEach( creator => this.executeIssueCreator(log, creator) );
    }

    // Can't add this method to GenericIssueCreator class because loading Issue Creators does not create class instance
    executeIssueCreator(log: Logs, creator: GenericIssueCreator) {

        console.log(creator.name, " handling log ", creator as IGenericIssueCreator);

        if (!creator.rules.logTypes.includes(log.type)) {
            console.log("logtype mismatch", log.type, creator.rules.logTypes);
            return;
        }

        if (creator.rules.sourceUrl !== 'none' && creator.rules.sourceUrl != log.sourceUrl) {
            console.log("source mismatch");
            return;
        }
        
        if (creator.rules.detectorUrl !== 'none' && creator.rules.detectorUrl != log.detectorUrl) {
            console.log("detector mismatch");
            return;
        }

        // Log belongs to Issue -> Add log
        creator.logs.unshift(log as LogMessageFormat);
        creator.save();
        console.log("added log");
    }
}