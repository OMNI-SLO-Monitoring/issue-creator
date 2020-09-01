import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface IService {
  id?: string;
  name: string;
  serviceUrl: string;
  idReceived?: boolean;
}

@Schema()
export class Service extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  serviceUrl: string;

  @Prop({ type: Boolean, required: true })
  idReceived: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
