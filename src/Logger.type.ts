import Logger from "./Logger.ts";

export type LoggerFileOptions = {
  dirPath: string
};

export type LoggerOptions<M extends string | number> = {
  mode:         M
  fileOptions?: LoggerFileOptions
};

export interface LoggerImpl<M extends string | number> {
  terminal: LoggerTerminalWrapper
  file:     LoggerFileWrapper
  in:       (modes: Iterable<M>) => Logger<M>
};

export type LoggerTerminalWrapper = {
  info:  (message: string, data: any[]) => void
  warn:  (message: string, data: any[]) => void
  error: (message: string, data: any[]) => void
};

export type LoggerFileWrapper = {
  info:  (message: string) => Promise<void>
  warn:  (message: string) => Promise<void>
  error: (message: string) => Promise<void>
};