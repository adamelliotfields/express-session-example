import passport from 'passport';
import { Strategy } from 'passport-local';

import { User, Users } from './users';

const users = Users.getInstance();

const strategy = new Strategy(async (username, password, done) => {
  try {
    const user = await users.findByUsername(username);

    if (!user) {
      return done(null, false);
    }

    if (user.password !== password) {
      return done(null, false);
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

passport.use(strategy);

passport.serializeUser((user, done) => {
  return done(null, (user as User).id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await users.findById(id as number);

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

export { passport };
