import request from 'supertest';
import test from 'ava';

import { app } from '../src/app';

test('GET /user should be allowed if logged in', async (t) => {
  const agent = request.agent(app);
  const { header } = await agent.post('/login').send({ username: 'admin', password: 'admin'});
  const { status } = await agent.get(header.location);

  t.is(status, 200, 'status should be 200');
});

test('GET /user should be forbidden if not logged in', async (t) => {
  const agent = request.agent(app);
  const { status } = await agent.get('/user');

  t.is(status, 401, 'status should be 401');
});
