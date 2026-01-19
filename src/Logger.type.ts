import Logger from "./Logger.ts";

export type LoggerFileOptions = {
  dirPath: string
};

export type LoggerOptions<M extends string | number> = {
  mode:        M
  fileOptions: LoggerFileOptions
};

export interface LoggerImpl<M extends string | number> {
  info:              LoggerLevelWrapper
  warn:              LoggerLevelWrapper
  error:             LoggerLevelWrapper
  in:                (modes: Iterable<M>) => Logger<M>
};

export type LoggerLevelWrapper = {
  file:     (message: string) => Promise<void>
  terminal: (message: string, data: any[]) => void
};