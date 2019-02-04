import express, { Request, Response } from 'express';
import http from 'http';

import { authenticate } from './middleware';
import { getPort } from './utils';

const port = getPort();

const router = express.Router();

router.post('/login', authenticate('local'), (req: Request, res: Response): void => {
  return res.redirect('/user');
});

// Need to use Express.Request to access Passport properties like req.isAuthenticated and req.user
router.post('/logout', (req: Request, res: Response): void => {
  if ((req as Express.Request).isAuthenticated && (req as Express.Request).isAuthenticated()) {
    (req as Express.Request).logout();
  }

  return (res as Response).redirect('/');
});

router.get('/user', (req: Request, res: Response): Response => {
  if (!(req as Express.Request).user) {
    return res.status(401).json({
      message: http.STATUS_CODES[401],
      status_code: 401,
    });
  }

  return res.status(200).json({ ...(req as Express.Request).user });
});

router.get('/favicon.ico', (req: Request, res: Response): Response => {
  return res.sendStatus(204);
});

router.get('/', (req: Request, res: Response): Response => res
  .status(200)
  .json({
    home_url: `http://localhost:${port}/`,
    login_url: `http://localhost:${port}/login`,
    logout_url: `http://localhost:${port}/logout`,
    user_url: `http://localhost:${port}/user`,
  }));

export { router };
