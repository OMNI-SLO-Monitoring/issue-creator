import { Module, HttpModule } from '@nestjs/common';
import { LogReceiverController } from './log-receiver/log-receiver.controller';
import { LogReceiverService } from './log-receiver/log-receiver.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

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
    HttpModule
  ],
  controllers: [LogReceiverController],
  providers: [LogReceiverService],
})
export class AppModule {}
