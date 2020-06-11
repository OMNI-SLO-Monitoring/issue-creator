import { Controller, Post, Body, Get } from '@nestjs/common';
import { LogReceiverService } from './log-receiver.service';

@Controller('log-receiver')
export class LogReceiverController {
  constructor(private logRcvService: LogReceiverService) {}
  /**
   * Logs are received here and handled accordingly
   */
  @Post()
  receiveLog(@Body() logMessage: any) {
    this.logRcvService.handleLogMessage(logMessage);
  }
}
