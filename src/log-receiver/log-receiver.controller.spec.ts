import { Test, TestingModule } from '@nestjs/testing';
import { LogReceiverController } from './log-receiver.controller';

describe('LogReceiver Controller', () => {
  let controller: LogReceiverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogReceiverController],
    }).compile();

    controller = module.get<LogReceiverController>(LogReceiverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
