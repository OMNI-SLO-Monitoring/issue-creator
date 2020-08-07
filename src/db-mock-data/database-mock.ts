import { LogType, LogMessageFormat } from 'logging-format';

/**This mocks the database and its functions especially
 *the function logic
 */
export class dbMock {
  data: LogMessageFormat;
  constructor(dto: LogMessageFormat) {
    this.data = dto;
  }

  /**
   * Mocks the save function of the Model by returning
   * the added log entry
   */
  save = (): LogMessageFormat => {
    return this.data;
  };

  /**
   * Mocks the find function and returns an execObj that returns
   * a defined list of registered services.
   */
  static find = () => {
    return execObj;
  };
}

/**
 * An object that returns a fixed array of logs that represent the
 * entries of the mock database
 */
let execObj = {
  exec: (): LogMessageFormat[] => {
    return [
      {
        type: LogType.TIMEOUT,
        time: Date.now(),
        source: 'Database Service',
        detector: 'Price Service',
        data: {
          timeoutDuration: 31,
        },
      },
      {
        type: LogType.CPU,
        time: Date.now(),
        source: 'Database Service',
        detector: 'Error Response Monitor',
        data: {
          cpuUtilization: 99,
        },
      },
    ];
  },
};
