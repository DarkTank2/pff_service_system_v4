const { createLogger, format, transports, version } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;
var env = require('./utilities/env');

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}; winston ${version}] ${level}: ${message}`;
});

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
const logger = createLogger({
  level: env.getEnv().loglevel || 'info',
  transports: [
    new transports.Console({ colorize: true }),
    new transports.File({ filename: 'maintenanceBackendError.log', level: 'error' }),
    new transports.File({ filename: 'maintenanceBackend.log'})
  ],
  format: combine(
    label({ label: 'scout-backend' }),
    timestamp(),
    colorize(),
    myFormat
  )
});

module.exports = logger;
