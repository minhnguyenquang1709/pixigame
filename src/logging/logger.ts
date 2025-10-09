import { ILogger } from "../interfaces/logging";

const LOG_CONFIG = {
  AudioSystem: { enabled: false, color: "#00FFFF" },
  InputSystem: { enabled: false, color: "#FFD700" },
  AppSystem: { enabled: true, color: "#00FF00" },
  CharacterSystem: { enabled: true, color: "#FFA500" },
};

export class Logger implements ILogger {
  private _prefix: string;
  private _color: string;

  constructor(name: string) {
    this._prefix = `[${name}]`;
    this._color = LOG_CONFIG[name as keyof typeof LOG_CONFIG]?.color || "white";
  }
  log(msg: string, context?: object): void {
    console.log(
      `%c${this._prefix}`,
      `color: ${this._color}`,
      msg,
      context || ""
    );
  }

  error(msg: string, context?: object): void {
    console.error(`%c${this._prefix}`, `color: #FF0000`, msg, context || "");
  }
}

class NullLogger extends Logger {
  constructor() {
    super("NULL");
  }
  log(msg: string, context?: object): void {}
  error(msg: string, context?: object): void {}
}

export class LoggerFactory {
  static loggers: Map<string, ILogger> = new Map();

  private static _nullLogger: ILogger = new NullLogger();

  static getLogger(name: keyof typeof LOG_CONFIG): ILogger {
    const config = LOG_CONFIG[name];
    if (this.loggers.has(name)) {
      return this.loggers.get(name) as ILogger;
    } else if (!config || !config.enabled) {
      return this._nullLogger;
    }

    const logger = new Logger(name);
    this.loggers.set(name, logger);
    return logger;
  }
}

export const InputSystemLogger = LoggerFactory.getLogger("InputSystem");
export const AppLogger = LoggerFactory.getLogger("AppSystem");
export const CharacterLogger = LoggerFactory.getLogger("CharacterSystem");
