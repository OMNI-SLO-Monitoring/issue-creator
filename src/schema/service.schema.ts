import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface IService {
  /** id of services */
  id?: string;
  /** name of services */
  name: string;
  /** url of services */
  serviceUrl: string;
}

@Schema()
export class Service extends Document {
  /** name of services */
  @Prop({ type: String, required: true })
  name: string;
  
  /** url of services */
  @Prop({ type: String, required: true })
  serviceUrl: string;

}

export const ServiceSchema = SchemaFactory.createForClass(Service);
