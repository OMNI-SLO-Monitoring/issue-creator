import { Test, TestingModule } from '@nestjs/testing';
import { ServiceRegistrationController } from './service-registration.controller';
import { ServiceRegistrationService } from './service-registration.service';
import { HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsSchema } from '../schema/logs.schema';
import { ServiceSchema } from '../schema/service.schema';

describe('ServiceRegistration Controller', () => {
  let controller: ServiceRegistrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        MongooseModule.forRoot('mongodb://localhost:27017/logDatabase'),
        MongooseModule.forFeature([
          { name: 'logs', schema: LogsSchema },
          { name: 'service', schema: ServiceSchema }
        ]),
      ],
      controllers: [ServiceRegistrationController],
      providers: [ServiceRegistrationService]
    }).compile();

    controller = module.get<ServiceRegistrationController>(ServiceRegistrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  it('should add service and return object that has an id', async () => {
    expect(await controller.addService({
      name: "Test",
      serviceUrl: "www.test.de"
    })).toHaveProperty("id");
  })
});
