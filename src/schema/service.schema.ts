import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface IService {
  id: string,
  name: string;
  serviceUrl: string;
  idRecieved: boolean;
}

@Schema()
export class Service extends Document {
  
  @Prop({ type: String, required: true})
  name: string;

  @Prop({ type: String, required: true })
  serviceUrl: string;

  @Prop({ type: Boolean, required: true })
  idRecieved: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);