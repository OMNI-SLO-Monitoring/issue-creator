import { Test, TestingModule } from '@nestjs/testing';
import { LogReceiverService } from './log-receiver.service';
import { HttpModule } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { LogMessageFormat, LogType } from 'logging-format';
import { dbMock } from '../db-mock-data/database-mock';

describe('LogReceiverService', () => {
  let service: LogReceiverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        LogReceiverService,
        {
          provide: getModelToken('logs'),
          useValue: dbMock,
        },
      ],
    }).compile();

    service = module.get<LogReceiverService>(LogReceiverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * Test function that probes if valid logs are added to database and
   * returned. In this case the test should be successful.
   */
  it('should add log message to database successfully', async () => {
    const logMock: LogMessageFormat = {
      type: LogType.CB_OPEN,
      time: Date.now(),
      source: 'Database Service',
      detector: 'Price Service',
      data: {
        failedResponses: 31,
        openTime: 10,
      },
    };
    expect(await service.addLogMessageToDatabase(logMock)).toBe(logMock);
  });

  /**
   * Test function that probes whether all predefined logs from
   * the mock database are returned correctly and fulfill the following
   * checks
   */
  it('should return all logs successfully', async () => {
    let fetchedLogs = await service.getAllLogs();
    expect(fetchedLogs.length).toBe(2);
    expect(fetchedLogs[0].type).toBe(LogType.TIMEOUT);
    expect(fetchedLogs[1].type).toBe(LogType.CPU);
  });
});
