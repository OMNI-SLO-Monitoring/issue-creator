import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsSchema } from 'src/schema/logs.schema'
import { LogReceiverController } from './log-receiver/log-receiver.controller';
import { LogReceiverService } from './log-receiver/log-receiver.service';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot('mongodb://localhost:27017/logDatabase'),
    MongooseModule.forFeature([{name: 'logs', schema: LogsSchema}]),
    ConfigModule.forRoot({isGlobal:true})
  ],
  controllers: [LogReceiverController],
  providers: [LogReceiverService],
})
export class AppModule {}
