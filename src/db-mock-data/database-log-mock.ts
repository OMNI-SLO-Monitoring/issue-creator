import { LogType, LogMessageFormat } from 'logging-format';

/**This mocks the database that contains the logs and its functions especially
 *the function logic
 */
export class dbLogMock {
  data;
  constructor(dto) {
    this.data = dto;
  }

  /**
   * Mocks the save function of the Model by returning
   * the added log entry
   */
  save = () => {
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
 * An object that returns a fixed array of logs that represents the
 * entries of the mock database
 */
let execObj = {
  exec: () => {
    return [
      {
        type: LogType.TIMEOUT,
        time: Date.now(),
        source: 'Database Service',
        detector: 'Price Service',
        data: {
          timeoutDuration: 31,
        },
        issueID: '1',
      },
      {
        type: LogType.CPU,
        time: Date.now(),
        source: 'Database Service',
        detector: 'Error Response Monitor',
        data: {
          cpuUtilization: 99,
        },
        issueID: '2',
      },
    ];
  },
};
