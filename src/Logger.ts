import STRING from "./const/STRING.const.ts";

import type { LoggerImpl, LoggerOptions } from "./Logger.type.ts";

import { mkdir, writeFile, appendFile } from "node:fs/promises";

import createTimeString from "./utils/create-time-string.util.ts";
import createFileName from "./utils/create-file-name.util.ts";
import colorizeLogLevel from "./utils/colorize-log-level.util.ts";
import isItemExist from "./utils/is-item-exist.util.ts";

export default class Logger<M extends string | number> implements LoggerImpl<M> {
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
        terminal(STRING.LOG_LEVEL.INFO, message, ...data);
      }

      this.currModes = undefined;
    },
    warn: (message: string, ...data: any[]): void => {
      if(!this.isFilterUsed() || this.isFilterHasCurrentMode()) {
        terminal(STRING.LOG_LEVEL.WARN, message, ...data);
      }

      this.currModes = undefined
    },
    error: (message: string, ...data: any[]): void => {
      if(!this.isFilterUsed() || this.isFilterHasCurrentMode()) {
        terminal(STRING.LOG_LEVEL.ERROR, message, ...data);
      }

      this.currModes = undefined
    }
  };

  public file = {
    info: async (message: string): Promise<void> => {
      if(!this.options?.fileOptions?.dirPath) {
        throw new TypeError(`The "fileOptions.dirPath" is typeof ${typeof this.options?.fileOptions?.dirPath} but must be string!`);
      }

      if(!this.isFilterUsed() || this.isFilterHasCurrentMode()) {
        await file<M>(STRING.LOG_LEVEL.INFO, message, this.options!);
      }

      this.currModes = undefined
    },
    warn: async (message: string): Promise<void> => {
      if(!this.options?.fileOptions?.dirPath) {
        throw new TypeError(`The "fileOptions.dirPath" is typeof ${typeof this.options?.fileOptions?.dirPath} but must be string!`);
      }

      if(!this.isFilterUsed() || this.isFilterHasCurrentMode()) {
        await file<M>(STRING.LOG_LEVEL.WARN, message, this.options!);
      }

      this.currModes = undefined;
    },
    error: async (message: string): Promise<void> => {
      if(!this.options?.fileOptions?.dirPath) {
        throw new TypeError(`The "fileOptions.dirPath" is typeof ${typeof this.options?.fileOptions?.dirPath} but must be string!`);
      }

      if(!this.isFilterUsed() || this.isFilterHasCurrentMode()) {
        await file<M>(STRING.LOG_LEVEL.ERROR, message, this.options!);
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
};

async function file<M extends string | number>(level: string, message: string, options: LoggerOptions<M>) { 
  if(!await isItemExist(options.fileOptions!.dirPath)) {
    await mkdir(options.fileOptions!.dirPath);
  }

  const fileMessage: string = `[${level} ${createTimeString()}]: ${message}\n`;
  const fileName: string = createFileName();
  const filePath: string = `${options.fileOptions!.dirPath}/${fileName}.txt`;
  
  if(!await isItemExist(filePath)) {
    await writeFile(filePath, fileMessage, { encoding: "utf-8" });
  } else {
    await appendFile(filePath, fileMessage, { encoding: "utf-8" });
  }
};

function terminal(level: string, message: string, ...data: any): void {
  const terminalMessage: string = `${colorizeLogLevel(level, `[${level} ${createTimeString()}]:`)} ${message}`;
  console.log(terminalMessage, ...(!data.length ? [] : data));
};