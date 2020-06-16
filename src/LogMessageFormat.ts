import { LogType } from './LogType';

export interface LogMessageFormat {
  type: LogType;
  time: any;
  source: String;
  target: String;
}
