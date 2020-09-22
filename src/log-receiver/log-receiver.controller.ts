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
   * Logs are received here and handled accordingly
   * 
   * @param logMessage is the log that is sent by the monitors and received here
   * @returns issueID that was received from the backend
   */
  @Post()
  @Header('Content-Type', 'application/json')
  receiveLog(@Body() logMessage: LogMessageFormat) {
    return this.logRcvService.handleLogMessage(logMessage);
  }

  /**
   * Returns all logs in the database
   * 
   * @returns all logs from the database
   */
  @Get()
  getAllLogs() {
    return this.logRcvService.getAllLogs();
  }

  /**
   * Returns all logs from one specific service identified by id
   * 
   * @returns all logs from one specific service identified by id
   */
  @Post('/:id')
  async getLogsByServiceId(@Param('id') id : string) {
    return this.logRcvService.getLogsByServiceId(id);
  }

  /**
   * Deletes all logs in the database.
   * 
   * @returns Promise with LogModel object whether it was successful  and  how many entries were deleted.
   */
  @Get('/:id/delete-all')
  async deleteAllLogs() {
    return this.logRcvService.deleteAllLogs();
  }
}
