import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogReceiverModule } from './log-receiver/log-receiver.module';

@Module({
  imports: [LogReceiverModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
