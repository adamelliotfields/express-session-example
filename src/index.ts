import debug from 'debug';

import { server } from './server';
import { getPort } from './utils';

const signals: Array<NodeJS.Signals> = ['SIGINT', 'SIGTERM', 'SIGUSR2'];

const port = getPort();

server.listen(port);

signals.forEach((signal) => {
  process.on(signal, onSignal);
});

function onSignal(signal: NodeJS.Signals): void {
  if (signal === 'SIGINT') {
    process.stderr.write('\n');
  }

  debug('*')(`${signal} signal received`);

  server.close(() => {
    debug('*')('shutting down');
    process.exit(0);
  });
}
