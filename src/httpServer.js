const fs = require('fs');
const https = require('https');
const debug = require('debug')('node-rest-api:server');
const http = require('http');
// const app = require('../app');
// const configuration = require('./configuration.json');

httpServer = {};

httpServer.start = (app, configuration) => {
  httpServer.httpPort = configuration.httpServer.port;
  app.set('port', httpServer.httpPort);

  httpServer.server = http.createServer(app);
  httpServer.server.listen(httpServer.httpPort, '0.0.0.0');
  httpServer.server.on('error', onError);
  httpServer.server.on('listening', onListening);
}

onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof httpServer.httpPort === 'string' ? `Pipe ${httpServer.httpPort}` : `Port ${httpServer.httpPort}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.log(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.log(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

onListening = () => {
  const addr = httpServer.server.address();
  const bind = typeof addr === 'string' ? `pipe  ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

module.exports = httpServer;