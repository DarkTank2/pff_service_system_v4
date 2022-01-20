/* eslint-disable no-console */
const app = require('./app');
const logger = require('./logger');
const port = app.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) =>
  {logger.error('Unhandled Rejection at: Promise ', p, reason)
  console.log(p)
  console.log(reason)}
);

server.on('listening', () =>
  logger.info('Feathers application started on http://' + app.get('host').toString() + ':' + port.toString())
);
