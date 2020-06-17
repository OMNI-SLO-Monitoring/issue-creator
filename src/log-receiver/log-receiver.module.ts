import { Module } from '@nestjs/common';
import { LogReceiverService } from './log-receiver.service';
import { LogReceiverController } from './log-receiver.controller';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { format } from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
  ],
  controllers: [LogReceiverController],
  providers: [LogReceiverService],
  exports: [LogReceiverService],
})
export class LogReceiverModule {}
