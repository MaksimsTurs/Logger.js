import STRING from "../const/STRING.const.ts";

import colorizer from "colorizer.js";

export default function colorizeLogLevel(level: string, text: string): string {
  switch(level) {
    case STRING.LOG_LEVEL.ERROR:
      return colorizer().bold().bg().rgb(255, 0, 0).text(text);
    case STRING.LOG_LEVEL.INFO:
      return colorizer().bold().bg().rgb(0, 0, 255).text(text);
    case STRING.LOG_LEVEL.WARN:
      return colorizer().bold().bg().rgb(255, 255, 0).text(text);
    default:
      return text;
  }
}