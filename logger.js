const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  level: 'info',
  transports: [new transports.Console()],
  exitOnError: false,
});

module.exports = logger;
