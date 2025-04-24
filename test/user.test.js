// tests/user.test.js
const request = require('supertest');
const app = require('../server'); // wherever you export your express instance
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let token;

describe('User Routes', () => {
  afterAll(async () => {
    // Clean up test user if exists
    await prisma.user.deleteMany({ where: { email: 'test@test.com' } });
    await prisma.$disconnect();
  });

  test('POST /api/user/register - success', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({
        name: 'Test',
        email: 'test@test.com',
        password: '1234'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User created successfully');
  });

  test('POST /api/user/register - duplicate', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({
        name: 'Test',
        email: 'test@test.com',
        password: '1234'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('POST /api/user/login - success', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({
        email: 'test@test.com',
        password: '1234'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    // Save cookie for next tests
    token = res.headers['set-cookie'][0];
  });

  test('GET /api/user/getUserData - with token', async () => {
    const res = await request(app)
      .get('/api/user/getUserData')
      .set('Cookie', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('test@test.com');
  });

  test('PUT /api/user/editUser - update name', async () => {
    const res = await request(app)
      .put('/api/user/editUser')
      .set('Cookie', token)
      .send({ name: 'Updated Test' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Test');
  });

  test('DELETE /api/user/deleteUser - with token', async () => {
    const res = await request(app)
      .delete('/api/user/deleteUser')
      .set('Cookie', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User deleted successfully');
  });
});
