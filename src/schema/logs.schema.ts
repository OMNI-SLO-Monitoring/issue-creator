import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { LogType } from 'logging-format';

/**
 * Schema for the log messages to be used by mongoose
 */
@Schema()
export class Logs extends Document {
  /** url of source */
  @Prop()
  sourceUrl: string;

  /** url of detector */
  @Prop()
  detectorUrl: string;

  /** time when log was reported */
  @Prop()
  time: number;

  /** message of log */
  @Prop()
  message: string;

  /** type of the log */
  @Prop()
  type: LogType;

  /** data of the log */
  @Prop()
  data: any;
  
  /** issueID of the log */
  @Prop()
  issueID: any;
}

export const LogsSchema = SchemaFactory.createForClass(Logs);