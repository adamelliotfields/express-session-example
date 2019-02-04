import debug from 'debug';
import http from 'http';

import { app } from './app';
import { getPort } from './utils';

const server = http.createServer(app);

const port = getPort();

server.on('error', onError);
server.on('listening', onListening);

function onError(err: NodeJS.ErrnoException): void {
  return debug('*')(err);
}

function onListening(): void {
  return debug('*')(`listening at port ${port}`);
}

export { server };
