export interface ILogger {
  log(msg: string, context?: object): void;
  error(msg: string, context?: object): void;
}
