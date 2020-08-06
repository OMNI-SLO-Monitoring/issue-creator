import { Test, TestingModule } from '@nestjs/testing';
import { LogReceiverController } from './log-receiver.controller';
import { LogReceiverService } from './log-receiver.service';
import { getModelToken } from '@nestjs/mongoose';
import { HttpModule, Logger } from '@nestjs/common';

describe('LogReceiver Controller', () => {
  let controller: LogReceiverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [LogReceiverController],
      providers: [
        LogReceiverService,
        {
          provide: getModelToken('logs'),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<LogReceiverController>(LogReceiverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
