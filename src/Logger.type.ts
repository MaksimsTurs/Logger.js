import Logger from "./Logger.ts";

export type LoggerFileOptions = {
  dirPath: string
  space?:  number
};

export type LoggerOptions<M extends string | number> = {
  mode:         M
  fileOptions?: LoggerFileOptions
};

export interface LoggerImpl<M extends string | number> {
  terminal: LoggerFuncsWrapper
  file:     LoggerFuncsWrapper
  in:       (modes: Iterable<M>) => Logger<M>
};

export type LoggerFuncsWrapper = {
  info:  (message: string, data: any[]) => void
  warn:  (message: string, data: any[]) => void
  error: (message: string, data: any[]) => void
};