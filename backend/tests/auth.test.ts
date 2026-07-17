import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { User } from '../src/modules/users/models/User.js';

let mongoServer: MongoMemoryServer;

describe('Authentication API', () => {
  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('registers a user and returns a JWT without the password', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'secure-password'
    });

    assert.equal(response.status, 201);
    assert.ok(response.headers['set-cookie']);
    assert.equal(response.body.user.email, 'test@example.com');
    assert.equal(response.body.user.password, undefined);
  });

  it('rejects duplicate email addresses', async () => {
    await User.create({ name: 'Existing User', email: 'test@example.com', password: 'secure-password' });
    const response = await request(app).post('/api/auth/register').send({
      name: 'Another User',
      email: 'TEST@example.com',
      password: 'secure-password'
    });

    assert.equal(response.status, 409);
    assert.match(response.body.message, /already exists/i);
  });

  it('logs in with valid credentials and rejects invalid credentials', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'secure-password'
    });

    const validResponse = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'secure-password'
    });
    const invalidResponse = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'wrong-password'
    });

    assert.equal(validResponse.status, 200);
    assert.ok(validResponse.headers['set-cookie']);
    assert.equal(invalidResponse.status, 401);
  });

  it('protects the current-user endpoint', async () => {
    const unauthorized = await request(app).get('/api/auth/me');
    assert.equal(unauthorized.status, 401);

    const registration = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'secure-password'
    });
    const accessCookie = registration.headers['set-cookie']?.find((cookie) =>
      cookie.startsWith('task_access_token=')
    );
    const authorized = await request(app)
      .get('/api/auth/me')
      .set('Cookie', accessCookie || '');

    assert.equal(authorized.status, 200);
    assert.equal(authorized.body.user.email, 'test@example.com');
  });

  it('returns field-level validation errors', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'A',
      email: 'not-an-email',
      password: 'short'
    });

    assert.equal(response.status, 400);
    assert.ok(response.body.details.length >= 3);
  });
});
