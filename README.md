# Logger.js

Small and simple logging library to log the information in to files and terminal.

## Table of Contents
  + [Documentation](#documentation)
    + [Creating a logger](#creating-a-logger)
    + [Log into terminal and file](#log-into-terminal-and-file)
    + [Custom prefix styles](#custom-prefix-styles)

## [Documentation](#documentation)
### [Creating a logger](#creating-a-logger)
```js
import Logger from "Logger.js";

export const logger = new Logger<"dev" | "prod">({
  // By setting "mode", we can filter out exactly what needs to be logged.
  // For example, when the "mode" has value "dev" only log calls that use
  // "dev" filter will be executed.
  mode: process.env.MODE,
  fileOptions: {
    //  With this option we set the dir path in which the log files will be served.
    dirPath: `${process.cwd()}/logs`
  }
});
```
### [Log into terminal and file](#log-into-terminal-and-file)
```js
import { logger } from "index.js";

function doStuff() {
  // ...do stuff

  // This info messages will be logged only in "dev" mode!
  logger.in(["dev"]).terminal.info("info:dev");
  // This warn messages will be logged only in "prod" mode!
  logger.in(["prod"]).terminal.warn("warn:prod", { code: 400 });
  // This error messages will be logged  in both "dev" and "prod" mode!
  logger.in(["dev", "prod"]).terminal.error("error:dev:prod", [1, 2, 3]);
  
  // ...do stuff
};

doStuff();
```
```js
import { logger } from "index.js";

function doStuff() {
  // ...do stuff

  // This info messages will be logged only in "dev" mode!
  logger.in(["dev"]).file.info("info:dev");
  // This warn messages will be logged only in "prod" mode!
  logger.in(["prod"]).file.warn("warn:prod", { code: 400 });
  // This error messages will be logged in both "dev" and "prod" mode!
  logger.in(["dev", "prod"]).file.error("error:dev:prod", [1, 2, 3]);
  
  // ...do stuff
};

doStuff();
```
Does not call `in` function when you want log specific messages in any mode.
```js
import { logger } from "index.js"

logger.terminal.info("This message will be logged in any mode!");
```
You can specify custom styles for all three log levels (info, warn and error).
```js
const logger = new Logger<"prod", "dev">({
  // ... default options
  customStyles: {
    info: Logger.colorizer.bold().font().rgb(100, 100, 255),
    error: Logger.colorizer.bold().font().rgb(255, 100, 100),
    warn: Logger.colorizer.bold().font().rgb(200, 200, 100)
  }
})
```