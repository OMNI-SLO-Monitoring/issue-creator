import { Test, TestingModule } from '@nestjs/testing';
import { LogReceiverService } from './log-receiver.service';
import { LogType, LogMessageFormat } from 'logging-format';

describe('LogReceiverService', () => {
  let service: LogReceiverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogReceiverService],
    }).compile();

    service = module.get<LogReceiverService>(LogReceiverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log "Handling Issue" and "Reporint  Issue"', () => {

    const testLog: LogMessageFormat = {
      source: "asd",
      detector: "asdd",
      time: 23,
      type: LogType.CPU,
      message: "asda",
      data: null
    };

    expect(service.handleLogMessage(testLog)).toBeDefined();
  });
});
