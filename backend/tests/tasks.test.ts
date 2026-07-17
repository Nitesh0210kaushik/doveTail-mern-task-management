import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../src/app';
import { Session } from '../src/modules/auth/models/Session';
import { Task } from '../src/modules/tasks/models/Task';
import { User } from '../src/modules/users/models/User';

let mongoServer: MongoMemoryServer;

const register = async (email: string): Promise<string[]> => {
  const response = await request(app).post('/api/auth/register').send({
    name: 'Task User',
    email,
    password: 'secure-password'
  });
  return response.headers['set-cookie'] as unknown as string[];
};

describe('Task API', () => {
  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    await Promise.all([Task.deleteMany({}), Session.deleteMany({}), User.deleteMany({})]);
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('creates and lists only the authenticated user tasks', async () => {
    const userCookies = await register('task-user@example.com');
    const createResponse = await request(app)
      .post('/api/tasks')
      .set('Cookie', userCookies)
      .send({
        title: 'Prepare sprint plan',
        description: 'Create the next sprint plan',
        status: 'Pending',
        priority: 'High',
        dueDate: '2030-01-15'
      });

    assert.equal(createResponse.status, 201);
    assert.equal(createResponse.body.task.priority, 'High');

    const listResponse = await request(app)
      .get('/api/tasks?search=sprint&sortBy=dueDate&sortOrder=asc&page=1&limit=10')
      .set('Cookie', userCookies);

    assert.equal(listResponse.status, 200);
    assert.equal(listResponse.body.tasks.length, 1);
    assert.equal(listResponse.body.totalRecords, 1);
    assert.equal(listResponse.body.totalPages, 1);
  });

  it('prevents a different user from accessing another users task', async () => {
    const ownerCookies = await register('owner@example.com');
    const otherUserCookies = await register('other@example.com');
    const createResponse = await request(app)
      .post('/api/tasks')
      .set('Cookie', ownerCookies)
      .send({
        title: 'Private task',
        description: 'Only the owner can access this',
        dueDate: '2030-01-15'
      });

    const response = await request(app)
      .get(`/api/tasks/${createResponse.body.task.id}`)
      .set('Cookie', otherUserCookies);

    assert.equal(response.status, 404);
  });

  it('validates task input', async () => {
    const cookies = await register('validation@example.com');
    const response = await request(app)
      .post('/api/tasks')
      .set('Cookie', cookies)
      .send({ title: 'x', status: 'Unknown' });

    assert.equal(response.status, 400);
    assert.equal(typeof response.body.field, 'string');
    assert.equal(typeof response.body.message, 'string');
  });
});
