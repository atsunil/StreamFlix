const request = require('supertest');
const app = require('../app'); // Adjust the path as necessary
const mongoose = require('mongoose');
const User = require('../models/User');

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'password123'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 400 for duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'password123'
        });
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another User',
          email: 'testuser@example.com',
          password: 'password456'
        });
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword'
        });
      expect(res.statusCode).toEqual(401);
    });
  });
});