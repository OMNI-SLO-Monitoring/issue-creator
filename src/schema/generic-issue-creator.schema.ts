import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { LogMessageFormat, LogType } from "logging-format";
import { Document } from 'mongoose';
import { Logs } from "./logs.schema";

export interface IGenericIssueCreator {
    _id?: string;
    name: string;
    description: string;
    rules: IssueCreatorRules;
    logs: LogMessageFormat[];
}


@Schema()
export class GenericIssueCreator extends Document {
    
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    rules: IssueCreatorRules;

    @Prop()
    logs: LogMessageFormat[];   // TODO: Probably should only save logIds but for sake of developing quick prototype this saves the corresponding logs
}

export const GenericIssueCreatorSchema = SchemaFactory.createForClass(GenericIssueCreator);

interface IssueCreatorRules {
    time: number;
    logTypes: LogType[],
    sourceUrl: string;
    detectorUrl: string;
}