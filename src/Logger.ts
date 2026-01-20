import STRING from "./const/STRING.const.ts";

import type { LoggerImpl, LoggerOptions } from "./Logger.type.ts";
import type { Colorizer } from "colorizer.js/src/colorizer.type.ts";

import colorizer from "colorizer.js";
import { mkdir, writeFile, appendFile } from "node:fs/promises";

import createTimeString from "./utils/create-time-string.util.ts";
import createFileName from "./utils/create-file-name.util.ts";
import { isObject, isItemExist } from "./utils/is.util.ts";

export default class Logger<M extends string | number> implements LoggerImpl<M> {
  public static colorizer: Colorizer = colorizer()
  
  public constructor(options: LoggerOptions<M>) {
    this.options = options;
  };

  public in(modes: Iterable<M>): Logger<M> {
    this.currModes = new Set<M>(modes);
    
    return this;
  };

  public terminal = {
    info: (message: string, ...data: any[]): void => {
      if(!this.isFilterUsed() || this.isFilterHasCurrentMode()) {
        this.toConsole(STRING.LOG_LEVEL.INFO, message, ...data);
      }

      this.currModes = undefined;
    },
    warn: (message: string, ...data: any[]): void => {
      if(!this.isFilterUsed() || this.isFilterHasCurrentMode()) {
        this.toConsole(STRING.LOG_LEVEL.WARN, message, ...data);
      }

      this.currModes = undefined
    },
    error: (message: string, ...data: any[]): void => {
      if(!this.isFilterUsed() || this.isFilterHasCurrentMode()) {
        this.toConsole(STRING.LOG_LEVEL.ERROR, message, ...data);
      }

      this.currModes = undefined
    }
  };

  public file = {
    info: async (message: string, ...data: any[]): Promise<void> => {
      if(!this.options?.fileOptions?.dirPath) {
        throw new TypeError(`The "fileOptions.dirPath" is typeof ${typeof this.options?.fileOptions?.dirPath} but must be string!`);
      }

      if(!this.isFilterUsed() || this.isFilterHasCurrentMode()) {
        await this.toFile(STRING.LOG_LEVEL.INFO, message, data);
      }

      this.currModes = undefined
    },
    warn: async (message: string, ...data: any[]): Promise<void> => {
      if(!this.options?.fileOptions?.dirPath) {
        throw new TypeError(`The "fileOptions.dirPath" is typeof ${typeof this.options?.fileOptions?.dirPath} but must be string!`);
      }

      if(!this.isFilterUsed() || this.isFilterHasCurrentMode()) {
        await this.toFile(STRING.LOG_LEVEL.WARN, message, data);
      }

      this.currModes = undefined;
    },
    error: async (message: string, ...data: any[]): Promise<void> => {
      if(!this.options?.fileOptions?.dirPath) {
        throw new TypeError(`The "fileOptions.dirPath" is typeof ${typeof this.options?.fileOptions?.dirPath} but must be string!`);
      }

      if(!this.isFilterUsed() || this.isFilterHasCurrentMode()) {
        await this.toFile(STRING.LOG_LEVEL.ERROR, message, data);
      }

      this.currModes = undefined
    },
  };

  private readonly options?: LoggerOptions<M> = undefined;
  private currModes?: Set<M>                  = undefined;

  private isFilterUsed(): boolean {
    return !!this.currModes;
  };

  private isFilterHasCurrentMode(): boolean {
    return !!(this.isFilterUsed() && this.currModes!.has(this.options!.mode));
  };
  
  private async toFile(level: string, message: string, data: any[]) {
    const { fileOptions } = this.options!;

    if(!await isItemExist(fileOptions!.dirPath)) {
      await mkdir(fileOptions!.dirPath);
    }
  
    const logMessage: string = this.createFileMessage(level, message, data);  
    const fileName: string = createFileName();
    const filePath: string = `${fileOptions!.dirPath}/${fileName}.txt`;
    
    if(!await isItemExist(filePath)) {
      await writeFile(filePath, logMessage, { encoding: "utf-8" });
    } else {
      await appendFile(filePath, logMessage, { encoding: "utf-8" });
    }
  };
  
  private toConsole(level: string, message: string, ...data: any[]): void {
    console.log(this.createTerminalMessage(level, message), ...(!data.length ? [] : data));
  };

  private createTerminalMessage(level: string, message: string): string {
    return `${this.colorize(level, `[${level} ${createTimeString()}]:`)} ${message}`;
  }

  private createFileMessage(level: string, message: string, data: any[]): string {
    let logMessage: string = `[${level} ${createTimeString()}]: ${message} `;
    const { fileOptions } = this.options!;

    for(let index: number = 0; index < data.length; index++) {
      if(isObject(data[index])) {
        logMessage += JSON.stringify(data[index], null, fileOptions!.space);
      } else {
        logMessage += data[index];
      }
    }
  
    logMessage += "\n";

    return logMessage;
  }

  private colorize(level: string, message: string): string {
    switch(level) {
      case STRING.LOG_LEVEL.ERROR:
        if(this.options?.customStyles?.error) {
          return this.options.customStyles.error.text(message);
        }
        
        return colorizer().bold().font().rgb(255, 0, 0).text(message);
      case STRING.LOG_LEVEL.INFO:
        if(this.options?.customStyles?.info) {
          return this.options.customStyles.info.text(message);
        }

        return colorizer().bold().font().rgb(0, 0, 255).text(message);
      case STRING.LOG_LEVEL.WARN:
        if(this.options?.customStyles?.warn) {
          return this.options.customStyles.warn.text(message);
        }

        return colorizer().bold().font().rgb(255, 255, 0).text(message);
      default:
        return message;
    }
  }
};