import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
  type: string;

  @Prop()
  data: any;
}

export const LogsSchema = SchemaFactory.createForClass(Logs);