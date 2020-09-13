import { LogType, LogMessageFormat } from 'logging-format';
import { ServiceSchema } from 'src/schema/service.schema';

/**This mocks the database that contains the registered services and its functions especially
 *the function logic
 */
export class dbServiceMock {
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

  static findById = id => {
    let services = execObj.exec();
    for (var i = 0; i < services.length; i++) {
      if (id === services[i].idReceived) {
        return 'Match';
      }
    }
    return;
  };
}

/**
 * An object that returns a fixed array of registered services that represents the
 * entries of the mock database
 */
let execObj = {
  exec: () => {
    return [
      {
        name: 'Price Service',
        serviceUrl: 'localhost:3300',
        idReceived: '1',
      },
      {
        name: 'Account Service',
        serviceUrl: 'localhost:3500',
        idReceived: '2',
      },
    ];
  },
};
