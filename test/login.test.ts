import request from 'supertest';
import test from 'ava';

import { app } from '../src/app';

test('POST /login with valid credentials should redirect to /user', async (t) => {
  const agent = request.agent(app);
  const { header, status } = await agent.post('/login').send({ username: 'admin', password: 'admin'});

  t.is(status, 302, 'status should be 302');
  t.is(header.location, '/user', 'header location should be /user');
});

test('POST /login with invalid credentials should return status 401', async (t) => {
  const agent = request.agent(app);
  const { status } = await agent.post('/login').send({ username: 'foo', password: 'bar' });

  t.is(status, 401, 'status should be 401');
});
