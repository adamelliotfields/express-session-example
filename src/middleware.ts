import http from 'http';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AuthenticateRet } from 'passport';

import { passport } from './passport';

export function authenticate(strategy: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): AuthenticateRet => passport
    .authenticate(strategy, (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({
          message: http.STATUS_CODES[401],
          status_code: 401,
        });
      }

      return (req as Express.Request).login(user, (e) => {
        if (e) {
          return next(e);
        }

        return next();
      });
    })(req, res, next);
}
