import { Injectable, HttpService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IService, Service } from '../schema/service.schema';
import { Model } from 'mongoose';

@Injectable()
export class ServiceRegistrationService {
  constructor(
    @InjectModel('service') private serviceModel: Model<Service>,
    private http: HttpService,
  ) {}

  /**
   * Adds a service to the database
   *
   * @param monitoringSelectionDTO Service to be monitored
   */
  async addService(service: IService): Promise<Service> {
    const res = new this.serviceModel(service);
    service.id = res.id;
    return res.save();
  }

  /**
   * Deletes a registered service by id in the database
   *
   * @param id Id of service
   *
   */
  deleteService(id: string) {
    return this.serviceModel.findByIdAndDelete(id);
  }

  /**
   * Returns all monitored services in the database
   *
   * @returns all registered services
   */
  getAllServices() {
    return this.serviceModel.find({}).exec();
  }

  async checkIfRegistered(serviceUrl: string): Promise<boolean> {
    const res = await this.serviceModel.find({ serviceUrl: serviceUrl });
    if (res) {
      return true;
    }
    return false;
  }
}
