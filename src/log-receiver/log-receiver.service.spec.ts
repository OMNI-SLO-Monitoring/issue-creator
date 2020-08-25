import { Test, TestingModule } from '@nestjs/testing';
import { LogReceiverService } from './log-receiver.service';
import { HttpModule } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { LogType} from 'logging-format';
import { DbMock } from '../db-mock-data/database-mock';
import { ConfigService, ConfigModule } from '@nestjs/config';


describe('LogReceiverService', () => {
  let service: LogReceiverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [
        LogReceiverService,
        {
          provide: getModelToken('logs'),
          useValue: DbMock,
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
    const logMock = {
      type: LogType.CB_OPEN,
      time: Date.now(),
      source: 'Database Service',
      detector: 'Price Service',
      message: 'Error',
      data: {
        failedResponses: 31,
        openTime: 10,
      },
      issueID: 'Issue_1'
    };
    jest.spyOn(service.cbOpenIssueCreator, "handleLog").mockImplementation(() => Promise.resolve("Issue_1"));
    expect(await service.addLogMessageToDatabase(logMock)).toStrictEqual(logMock);
  });

  /**
   * Test function that probes whether all predefined logs from
   * the mock database are returned correctly and fulfill the following
   * checks. In this case the checks are successful.
   */ 
  it('should return all logs and pass all checks', async () => {
    const fetchedLogs = await service.getAllLogs();
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
    const fetchedLogs = await service.getAllLogs();
    expect(fetchedLogs.length == 1).toBeFalsy();
    expect(fetchedLogs[0].type === LogType.ERROR).toBeFalsy();
    expect(fetchedLogs[1].type === LogType.CB_OPEN).toBeFalsy();
  });
});
