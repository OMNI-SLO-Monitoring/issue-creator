import { Test, TestingModule } from '@nestjs/testing';
import { LogReceiverService } from './log-receiver.service';
import { LogType, LogMessageFormat } from 'logging-format';
import { WinstonModule } from 'nest-winston';
import winston = require('winston');
import { HttpModule } from '@nestjs/common';
import { LogReceiverController } from './log-receiver.controller';
import { getModelToken } from '@nestjs/mongoose';

describe('LogReceiverService', () => {
  let service: LogReceiverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogReceiverService, {
        provide: getModelToken('logs'),
        useValue: 1
      }],
      controllers: [LogReceiverController],
      imports: [WinstonModule.forRoot({
        format: winston.format.printf(info => {
          let logMsg = `${info.message}`;
          return logMsg;
        }),
        transports: [
          new winston.transports.File({
            filename: './static/received-logs.json',
          }),
          new winston.transports.Console(),
        ],
      }),HttpModule]
    }).compile();

    service = module.get<LogReceiverService>(LogReceiverService);
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
