import { Injectable, HttpService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IService, Service } from '../schema/service.schema';
import { Model } from 'mongoose';

@Injectable()
export class ServiceRegistrationService {
  constructor(
    @InjectModel('service') private serviceModel: Model<Service>,
    private http: HttpService,
  ) { }

  /**
   * Adds a service to the database
   *
   * @param monitoringSelectionDTO Service to be monitored
   * @returns Promise containing the inserted service
   */
  async addService(service: IService): Promise<Service> {
    if (!service.serviceUrl.endsWith('/')) {
      service.serviceUrl = service.serviceUrl + "/";
    }
    const res = new this.serviceModel(service);
    service.id = res.id;
    return res.save();
  }

  /**
   * Deletes a registered service by id in the database
   *
   * @param id Id of service
   * @returns the found document corresponding to the provided id
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

  /**
   * Returns the found document with the provided id
   *
   * @param id Id of the service
   * @returns the found document corresponding to the provided id
   */
  async getService(id: string): Promise<Service> {
    return await this.serviceModel.findById(id);
  }

  /**
   * Checks if the service is already registered or not by searching in the database
   * for the matching service url
   *
   * @param serviceUrl service url of the service to be checked
   * @returns true if service is registered, false otherwise
   */
  async checkIfRegistered(serviceUrl: string): Promise<boolean> {
    const res = await this.serviceModel.find({ serviceUrl: serviceUrl });
    console.log("res", res);

    if (res.length > 0) {
      return true;
    }
    return false;
  }

  /**
   * Updates the service url of a registered service in the database
   * to conform to the defined url format
   * @param serviceUrl the service url of the service to be updated
   */
  async findAndUpdate(serviceUrl: string) {
    console.log("service url: " + serviceUrl);
    const serviceUrlWithSlash = serviceUrl + '/';

    await this.serviceModel.update(
      { serviceUrl: serviceUrl },
      { $set: { serviceUrl: serviceUrlWithSlash } },
    );
  }
}
