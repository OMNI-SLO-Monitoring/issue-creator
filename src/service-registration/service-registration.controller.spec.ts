import { Test, TestingModule } from '@nestjs/testing';
import { ServiceRegistrationController } from './service-registration.controller';
import { ServiceRegistrationService } from './service-registration.service';
import { HttpModule } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { LogsSchema } from '../schema/logs.schema';
import { ServiceSchema } from '../schema/service.schema';
import { dbServiceMock } from '../db-mock-data/database-service-mock';

describe('ServiceRegistration Controller', () => {
  let controller: ServiceRegistrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [ServiceRegistrationController],
      providers: [
        ServiceRegistrationService,
        {
          provide: getModelToken('service'),
          useValue: dbServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ServiceRegistrationController>(
      ServiceRegistrationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add service and return object that has an id', async () => {
    expect(
      await controller.addService({
        name: 'Test',
        serviceUrl: 'www.test.de',
      }),
    ).toHaveProperty('id');
  });
});
