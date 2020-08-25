import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { LogType } from 'logging-format';

@Schema()
export class Logs extends Document {
  @Prop()
  source: string;

  @Prop()
  detector: string;

  @Prop()
  time: number;

  @Prop()
  message: string;

  @Prop()
  type: LogType;

  @Prop()
  data: any;

  @Prop()
  issueID: any;
}

export const LogsSchema = SchemaFactory.createForClass(Logs);