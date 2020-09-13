import { Test, TestingModule } from '@nestjs/testing';
import { LogReceiverController } from './log-receiver.controller';
import { LogReceiverService } from './log-receiver.service';
import { getModelToken } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/common';
import { dbLogMock } from '../db-mock-data/database-log-mock';
import { ServiceRegistrationService } from '../service-registration/service-registration.service';
import { ConfigModule } from '@nestjs/config';
import { dbServiceMock } from '../db-mock-data/database-service-mock';

describe('LogReceiver Controller', () => {
  let controller: LogReceiverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      controllers: [LogReceiverController],
      providers: [
        LogReceiverService,
        ServiceRegistrationService,
        {
          provide: getModelToken('logs'),
          useValue: dbLogMock,
        },
        {
          provide: getModelToken('service'),
          useValue: dbServiceMock,
        },
      ],
    }).compile();

    controller = module.get<LogReceiverController>(LogReceiverController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
