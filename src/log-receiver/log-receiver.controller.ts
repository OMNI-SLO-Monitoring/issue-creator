import { Controller, Post, Body, Get, Header, Param } from '@nestjs/common';
import { LogReceiverService } from './log-receiver.service';
import { LogMessageFormat } from 'logging-format';

/**
 * This component receives the log messages from the monitors
 */
@Controller()
export class LogReceiverController {
  constructor(private logRcvService: LogReceiverService) {}
  /**
   * Logs are received here and handled depending on the log type e.g. CPU, Error etc.
   * 
   * @param logMessage is the log that is sent by the monitors and received here
   */
  @Post()
  @Header('Content-Type', 'application/json')
  receiveLog(@Body() logMessage: LogMessageFormat) {
    this.logRcvService.handleLogMessage(logMessage);
    this.logRcvService.addLogMessageToDatabase(logMessage);
    console.log('Received!');
  }
  /**
   * Returns all logs in the database
   */
  @Get()
  getAllLogs() {
    return this.logRcvService.getAllLogs();
  }

  /**
   * Returns all logs from one specific service identified by id
   */
  @Get('/:id')
  getLogsByServiceId(@Param('id') id : string) {
    return this.logRcvService.getLogsByServiceId(id);
  }
}
