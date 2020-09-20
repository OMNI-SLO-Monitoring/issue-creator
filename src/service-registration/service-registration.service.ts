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
   * 
   * @returns added service
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
   * @return true if was deleted and false if not
   */
  async deleteService(id: string): Promise<boolean> {
    try {
      const res = await this.serviceModel.findByIdAndDelete(id);
    } catch {
      return true;
    }
  }

  /**
   * Returns all monitored services in the database
   *
   * @returns all registered services
   */
  getAllServices() {
    return this.serviceModel.find({}).exec();
  }

  /**
   * finds a service by a given id
   * 
   * @param id of a service
   * 
   * @returns service with the given id
   */
  async getService(id: string): Promise<Service> {
    return await this.serviceModel.findById(id);
  }

  /**
   * checks if a service url is registered
   * 
   * @param serviceUrl that should be checked
   * 
   * @returns true if registered and false if not
   */
  async checkIfRegistered(serviceUrl: string): Promise<boolean> {
    const res = await this.serviceModel.find({ serviceUrl: serviceUrl });
    if (res) {
      return true;
    }
    return false;
  }
}
