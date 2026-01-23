import type { Colorizer } from "colorizer.js/src/colorizer.type.ts";

import Logger from "./Logger.ts";

export type LoggerFileOptions = {
  dirPath: string
  space?:  number
};

export type LoggerOptions<M extends string | number> = {
  mode:         M
  styling?:     LoggerStyling
  fileOptions?: LoggerFileOptions
};

export type LoggerStyling = {
  colors?:    LoggerStylingColors,
  logFormat?: string
};

export type LoggerStylingColors = {
  info?:  Colorizer
  warn?:  Colorizer
  error?: Colorizer
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