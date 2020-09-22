import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export interface IGenericIssueCreator {
    id?: string;
    name: string;
    description: string;
}


@Schema()
export class GenericIssueCreator extends Document {
    
    @Prop()
    name: string;

    @Prop()
    description: string;
}

export const GenericIssueCreatorSchema = SchemaFactory.createForClass(GenericIssueCreator);