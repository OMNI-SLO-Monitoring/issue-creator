import { Controller, Post, Body, Get } from '@nestjs/common';
import { LogReceiverService } from './log-receiver.service';
import { LogMessageFormat } from 'src/LogMessageFormat';

@Controller('log-receiver')
export class LogReceiverController {
  constructor(private logRcvService: LogReceiverService) {}
  /**
   * Logs are received here and handled accordingly
   * @param logMessage is the log that is sent by the monitors and received here
   */
  @Post()
  receiveLog(@Body() logMessage: LogMessageFormat) {
    this.logRcvService.handleLogMessage(logMessage);
  }
}
