# Logger.js

Small and simple logging library to log the information in to files and terminal.

## Table of Contents
  + [Documentation](#documentation)
    + [Creating a logger](#creating-a-logger)
    + [Log into terminal](#log-into-terminal)
    + [Log into file](#log-into-file)

## [Documentation](#documentation)
To have access to logging functions you need to specify a modes with `in` function to sort the loggs out. The coloring is supported only in terminal yet.
### [Creating a logger](#creating-a-logger)
```js
import Logger from "Logger.js";

export const logger = new Logger<"dev" | "prod">({
  // By setting "mode", we can filter out exactly what needs to be logged.
  // For example, when the "mode" has value "dev" only log calls that use
  // "dev" filter will be executed.
  mode: process.env.MODE,
  // This options will be used by a function that logs information into the files.
  fileOptions: {
    //  With this option we set the dir path in which the log files will be served.
    dirPath: `${process.cwd()}/logs`
  }
});
```
### [Log into terminal](#log-into-terminal)
```js
import { logger } from "index.js";

function doStuff() {
  // ...do stuff

  // This info messages will be logged only in "dev" mode!
  logger.in(["dev"]).info.terminal("info:dev");
  // This warn messages will be logged only in "prod" mode!
  logger.in(["prod"]).warn.terminal("warn:prod", { code: 400 });
  // This error messages will be logged  in both "dev" and "prod" mode!
  logger.in(["dev", "prod"]).error.terminal("error:dev:prod", [1, 2, 3]);
  
  // ...do stuff
};

doStuff();
```

### [Log into file](#log-into-file)
```js
import { logger } from "index.js";

function doStuff() {
  // ...do stuff

  // This info messages will be logged only in "dev" mode!
  logger.in(["dev"]).info.file("info:dev");
  // This warn messages will be logged only in "prod" mode!
  logger.in(["prod"]).warn.file("warn:prod");
  // This error messages will be logged  in both "dev" and "prod" mode!
  logger.in(["dev", "prod"]).error.file("error:dev:prod");
  
  // ...do stuff
};

doStuff();
```