import debug from 'debug';
import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import session, { SessionOptions } from 'express-session';

import { passport } from './passport';
import { router } from './router';
import { MemoryStore } from './session';

const sessionOptions: SessionOptions = {
  store: new MemoryStore(),
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: /* one minute */ (60 * 1000),
  },
};

const app = express();

app.use(express.json());

app.use(session(sessionOptions));

app.use(passport.initialize());

app.use(passport.session());

app.use(router);

app.use((req: Request, res: Response, next: NextFunction): Response => {
  return res.status(404).json({
    message: http.STATUS_CODES[404],
    status_code: 404,
  });
});

app.use((error: Error, req: Request, res: Response, next: NextFunction): Response => {
  debug('*')(error);

  return res.status(500).json({
    message: http.STATUS_CODES[500],
    status_code: 500,
  });
});

export { app };
