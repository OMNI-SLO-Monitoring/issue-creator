import { Test, TestingModule } from '@nestjs/testing';
import { LogReceiverController } from './log-receiver.controller';
import { LogReceiverService } from './log-receiver.service';
import { WinstonModule } from 'nest-winston';
import { AppModule } from 'src/app.module';
import winston = require('winston');
import { HttpModule } from '@nestjs/common';

describe('LogReceiver Controller', () => {
  let controller: LogReceiverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogReceiverController],
      providers: [LogReceiverService],
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
      }),
    HttpModule, ]
    }).compile();

    controller = module.get<LogReceiverController>(LogReceiverController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
