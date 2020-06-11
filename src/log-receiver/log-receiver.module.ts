import { Module } from '@nestjs/common';
import { LogReceiverService } from './log-receiver.service';
import { LogReceiverController } from './log-receiver.controller';

@Module({
  controllers: [LogReceiverController],
  providers: [LogReceiverService],
  exports: [LogReceiverService],
})
export class LogReceiverModule {}
