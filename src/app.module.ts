import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogReceiverModule } from './log-receiver/log-receiver.module';
import { IssueCreatorModule } from './issue-creator/issue-creator.module';
@Module({
  imports: [LogReceiverModule, IssueCreatorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
