import { Injectable, HttpService } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ServiceSchema, IService, Service } from "src/schema/service.schema";
import { Model } from "mongoose";

@Injectable()
export class ServiceRegistrationService {

    constructor(@InjectModel("service") private serviceModel: Model<Service>, private http: HttpService) {}

    /**
     * Adds a service to the database
     *
     * @param monitoringSelectionDTO Service to be monitored
     */
    async addService(service: IService): Promise<Service> {
        const res = new this.serviceModel(service);
        service.id = res.id;
        res.idRecieved = await this.transmitServiceId(res);
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

    async retransmitServiceId(serviceId: string) {
        const res = await this.serviceModel.findById(serviceId);
        res.idRecieved = await this.transmitServiceId(res);
        return res.save();
    }

    async checkIfRegistered(serviceId: string): Promise<boolean> {
        const res = await this.serviceModel.findById(serviceId);
        if (res) {
            return true;
        }
        return false;
    }

    private async transmitServiceId(service: Service): Promise<boolean> {
        try {
            await this.http.post(`${service.serviceUrl}/service-registration`, {
                "name": service.name,
                "id":  service.id
            }).toPromise();
            return true;
        } catch (error) {
            console.log("Could not transmit Id");
            return false;
        }
    }
}