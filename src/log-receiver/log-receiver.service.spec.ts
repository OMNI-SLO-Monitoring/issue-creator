import { Test, TestingModule } from '@nestjs/testing';
import { LogReceiverService } from './log-receiver.service';
import { HttpModule } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { WinstonLogger } from 'nest-winston';
import { LogMessageFormat, LogType } from 'logging-format';

describe('LogReceiverService', () => {
  let service: LogReceiverService;

  beforeEach(async () => {
    //database mock with save function
    function dbMock(dto) {
      this.data = dto;
      this.save = () => {
        return this.data;
      };
    }
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
   * Function that probes if valid logs are added to database
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
});
