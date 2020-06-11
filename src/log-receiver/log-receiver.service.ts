import { Injectable } from '@nestjs/common';

@Injectable()
export class LogReceiverService {
  /**
   * Log messages are handled here, meaning their type is identified
   * and they are sent to the respective issue creator component
   */
  handleLogMessage(logMessage: any) {
    //handle log
  }
}
