import { Test, TestingModule } from '@nestjs/testing';
import { ServiceRegistrationController } from './service-registration.controller';
import { ServiceRegistrationService } from './service-registration.service';
import { HttpModule } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
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

  it('should delete service', async () => {
    const service = await controller.addService({
      name: 'Test',
      serviceUrl: 'www.test.de',
    });

    expect(
      await controller.deleteService(service.id)
    ).toBeTruthy();
  })
});
