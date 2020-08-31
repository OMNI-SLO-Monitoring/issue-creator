import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsSchema } from 'src/schema/logs.schema';
import { LogReceiverController } from './log-receiver/log-receiver.controller';
import { LogReceiverService } from './log-receiver/log-receiver.service';
import { ServiceRegistrationController } from './service-registration/service-registration.controller';
import { ServiceRegistrationService } from './service-registration/service-registration.service';
import { ServiceSchema } from './schema/service.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot('mongodb://localhost:27017/logDatabase'),
    MongooseModule.forFeature([
      { name: 'logs', schema: LogsSchema },
      { name: 'service', schema: ServiceSchema }
    ]),
    ConfigModule.forRoot({isGlobal:true})
  ],
  controllers: [
    LogReceiverController,
    ServiceRegistrationController
  ],
  providers: [
    LogReceiverService,
    ServiceRegistrationService
  ],
})
export class AppModule {}
