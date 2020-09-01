import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Header,
} from '@nestjs/common';
import { IService } from 'src/schema/service.schema';
import { ServiceRegistrationService } from './service-registration.service';

@Controller('service-registration')
export class ServiceRegistrationController {
  constructor(private serviceRegistration: ServiceRegistrationService) {}

  /**
   * @returns all registered services in the database
   */
  @Get('/getall') // TODO: WHY????????
  getServices() {
    return this.serviceRegistration.getAllServices();
  }

  /**
   * Receives requests to add a service to be registered to the database
   *
   * @param service to be monitored
   */
  @Post()
  addService(@Body() service: IService) {
    return this.serviceRegistration.addService(service);
  }

  /**
   * Receives requests to delete monitored services by id
   *
   * @param id of a registered Service
   */
  @Delete('/:id')
  deleteSelection(@Param('id') id: string) {
    return this.serviceRegistration.deleteService(id);
  }

  @Post('/:id')
  retransmitServiceId(@Param('id') id: string) {
    return this.serviceRegistration.retransmitServiceId(id);
  }
}
