import { Controller, Post, Body, Get, Header } from '@nestjs/common';
import { LogReceiverService } from './log-receiver.service';
import { LogMessageFormat } from 'logging-format';

/**
 * This component receives the log messages from the monitors
 */
@Controller()
export class LogReceiverController {
  constructor(private logRcvService: LogReceiverService) {}
  /**
   * Logs are received here and handled accordingly
   * @param logMessage is the log that is sent by the monitors and received here
   */
  @Post()
  @Header('Content-Type', 'application/json')
  receiveLog(@Body() logMessage: LogMessageFormat) {
    this.logRcvService.handleLogMessage(logMessage);
    console.log('Received!');
  }
}
