import { Test, TestingModule } from '@nestjs/testing';
import { LogReceiverService } from './log-receiver.service';
import { HttpModule } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { LogMessageFormat, LogType } from 'logging-format';
import { dbMock } from '../db-mock-data/database-mock';
import { ServiceRegistrationService } from '../service-registration/service-registration.service';

describe('LogReceiverService', () => {
  let service: LogReceiverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        LogReceiverService,
        ServiceRegistrationService,
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
   * checks. In this case the checks are successful.
   */
  it('should return all logs and pass all checks', async () => {
    let fetchedLogs = await service.getAllLogs();
    expect(fetchedLogs.length).toBe(2);
    expect(fetchedLogs[0].type).toBe(LogType.TIMEOUT);
    expect(fetchedLogs[1].type).toBe(LogType.CPU);
  });

  /**
   * Test function that probes whether all predefined logs from
   * the mock database are returned correctly and fulfill the following
   * checks. In this case the checks are not successful.
   */
  it('should return all logs and fail all checks', async () => {
    let fetchedLogs = await service.getAllLogs();
    expect(fetchedLogs.length == 1).toBeFalsy();
    expect(fetchedLogs[0].type === LogType.ERROR).toBeFalsy();
    expect(fetchedLogs[1].type === LogType.CB_OPEN).toBeFalsy();
  });
});
