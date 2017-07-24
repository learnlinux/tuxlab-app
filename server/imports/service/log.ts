
  import * as winston from "winston";

  export var log = new (winston.Logger)({
    level: 'debug',
    transports: [
      new (winston.transports.Console)()
    ]
  });
