import { Test, TestingModule } from '@nestjs/testing';
import { LogReceiverService } from './log-receiver.service';
import { HttpModule } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { LogType } from 'logging-format';
import { dbLogMock } from '../db-mock-data/database-log-mock';
import { ServiceRegistrationService } from '../service-registration/service-registration.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbServiceMock } from '../db-mock-data/database-service-mock';

describe('LogReceiverService', () => {
  let service: LogReceiverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [
        LogReceiverService,
        ServiceRegistrationService,
        ConfigService,
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

    service = module.get<LogReceiverService>(LogReceiverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * Test function that probes if valid logs of type CB_OPNE are added to database and
   * returned. In this case the test should be successful.
   */
  it('should add log message to database successfully', async () => {
    const logMock = {
      type: LogType.CB_OPEN,
      time: Date.now(),
      sourceUrl: 'Database Service',
      detectorUrl: '1',
      message: 'Error',
      data: {
        failedResponses: 31,
        openTime: 10,
      },
      issueID: '1',
    };
    jest
      .spyOn(service.cbOpenIssueCreator, 'handleLog')
      .mockImplementation(() => Promise.resolve('1'));
    expect(await service.addLogMessageToDatabase(logMock, '1')).toBeDefined();
  });

  /**
 * Test function that probes if valid logs of type TIMEOUT are added to database and
 * returned. In this case the test should be successful.
 */
  it('should add log message to database successfully', async () => {
    const logMock = {
      type: LogType.TIMEOUT,
      time: Date.now(),
      sourceUrl: 'Database Service',
      detectorUrl: '1',
      message: 'Error',
      data: {
        timeoutDuration : 1000
      },
      issueID: '1',
    };
    jest
      .spyOn(service.cbOpenIssueCreator, 'handleLog')
      .mockImplementation(() => Promise.resolve('1'));
    expect(await service.addLogMessageToDatabase(logMock, '1')).toBeDefined();
  });

  /**
  * Test function that probes if valid logs of type CPU are added to database and
  * returned. In this case the test should be successful.
  */
  it('should add log message to database successfully', async () => {
    const logMock = {
      type: LogType.CPU,
      time: Date.now(),
      sourceUrl: 'Database Service',
      detectorUrl: '1',
      message: 'Error',
      data: {
        cpuUtilization: 75
      },
      issueID: '1',
    };
    jest
      .spyOn(service.cbOpenIssueCreator, 'handleLog')
      .mockImplementation(() => Promise.resolve('1'));
    expect(await service.addLogMessageToDatabase(logMock, '1')).toBeDefined();
  });
  /**
   * Test function that probes if valid logs of type ERROR are added to database and
   * returned. In this case the test should be successful.
   */
  it('should add log message to database successfully', async () => {
    const logMock = {
      type: LogType.ERROR,
      time: Date.now(),
      sourceUrl: 'Database Service',
      detectorUrl: '1',
      message: 'Error',
      data: {
        expected: 'nice',
        actual: 'not nice'
      },
      issueID: '1',
    };
    jest
      .spyOn(service.cbOpenIssueCreator, 'handleLog')
      .mockImplementation(() => Promise.resolve('1'));
    expect(await service.addLogMessageToDatabase(logMock, '1')).toBeDefined();
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
