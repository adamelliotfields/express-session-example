import request from 'supertest';
import test from 'ava';

import { app } from '../src/app';

test('POST /logout should log user out', async (t) => {
  const agent = request.agent(app);
  await agent.post('/login').send({ username: 'admin', password: 'admin'});
  await agent.post('/logout');
  const { status } = await agent.get('/user');

  t.is(status, 401, 'status should be 401');
});
