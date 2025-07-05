
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../src/models/User');

// Test database configuration
const MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/project-management-test';

describe('Authentication Endpoints', () => {
  let server;

  // Setup test database connection
  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }
    
    // Start server for testing
    server = app.listen(0); // Use random available port
  });

  // Clean up database before each test
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // Close connections after all tests
  afterAll(async () => {
    await mongoose.connection.close();
    if (server) {
      server.close();
    }
  });

  describe('POST /api/auth/register', () => {
    const validUserData = {
      email: 'test@example.com',
      password: 'Test@123456'
    };

    test('should register a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', validUserData.email);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).not.toHaveProperty('password');
    });

    test('should not register user with invalid email', async () => {
      const invalidEmailData = {
        email: 'invalid-email',
        password: 'Test@123456'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidEmailData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: expect.stringContaining('valid email')
          })
        ])
      );
    });

    test('should not register user with weak password', async () => {
      const weakPasswordData = {
        email: 'test@example.com',
        password: '123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(weakPasswordData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'password'
          })
        ])
      );
    });

    test('should not register user with existing email', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(201);

      // Attempt to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'User with this email already exists');
      expect(response.body).toHaveProperty('code', 'USER_EXISTS');
    });

    test('should hash password before saving', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(201);

      const user = await User.findOne({ email: validUserData.email }).select('+password');
      expect(user.password).not.toBe(validUserData.password);
      expect(user.password.length).toBeGreaterThan(50); // Hashed password should be longer
    });
  });

  describe('POST /api/auth/login', () => {
    const userCredentials = {
      email: 'test@example.com',
      password: 'Test@123456'
    };

    beforeEach(async () => {
      // Create a user before each login test
      await request(app)
        .post('/api/auth/register')
        .send(userCredentials)
        .expect(201);
    });

    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(userCredentials)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', userCredentials.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    test('should not login with invalid email', async () => {
      const invalidCredentials = {
        email: 'wrong@example.com',
        password: userCredentials.password
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidCredentials)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Invalid email or password');
      expect(response.body).toHaveProperty('code', 'INVALID_CREDENTIALS');
    });

    test('should not login with invalid password', async () => {
      const invalidCredentials = {
        email: userCredentials.email,
        password: 'WrongPassword123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidCredentials)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Invalid email or password');
      expect(response.body).toHaveProperty('code', 'INVALID_CREDENTIALS');
    });

    test('should not login with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: userCredentials.email })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    test('should not login with malformed email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'not-an-email',
          password: userCredentials.password
        })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
    });
  });

  describe('GET /api/auth/profile', () => {
    let authToken;
    let userId;

    beforeEach(async () => {
      // Register and login to get token
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test@123456'
        });
      
      authToken = registerResponse.body.token;
      userId = registerResponse.body.user.id;
    });

    test('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).toHaveProperty('id', userId);
      expect(response.body.user).not.toHaveProperty('password');
    });

    test('should not get profile without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Access denied. No token provided.');
      expect(response.body).toHaveProperty('code', 'NO_TOKEN');
    });

    test('should not get profile with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Access denied. Invalid token.');
      expect(response.body).toHaveProperty('code', 'INVALID_TOKEN');
    });

    test('should not get profile with malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Access denied. Invalid token format.');
    });
  });

  describe('POST /api/auth/logout', () => {
    let authToken;

    beforeEach(async () => {
      // Register and login to get token
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test@123456'
        });
      
      authToken = registerResponse.body.token;
    });

    test('should logout successfully with valid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Logged out successfully');
    });

    test('should not logout without token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body).toHaveProperty('code', 'NO_TOKEN');
    });
  });

  describe('GET /api/auth/verify-token', () => {
    let authToken;
    let userData;

    beforeEach(async () => {
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test@123456'
        });
      
      authToken = registerResponse.body.token;
      userData = registerResponse.body.user;
    });

    test('should verify valid token', async () => {
      const response = await request(app)
        .get('/api/auth/verify-token')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('valid', true);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', userData.email);
    });

    test('should not verify invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/verify-token')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('code', 'INVALID_TOKEN');
    });
  });

  describe('PUT /api/auth/change-password', () => {
    let authToken;

    beforeEach(async () => {
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test@123456'
        });
      
      authToken = registerResponse.body.token;
    });

    test('should change password with valid data', async () => {
      const passwordData = {
        currentPassword: 'Test@123456',
        newPassword: 'NewTest@123456',
        confirmPassword: 'NewTest@123456'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Password changed successfully');

      // Verify old password no longer works
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test@123456'
        })
        .expect(400);

      // Verify new password works
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'NewTest@123456'
        })
        .expect(200);
    });

    test('should not change password with wrong current password', async () => {
      const passwordData = {
        currentPassword: 'WrongPassword123',
        newPassword: 'NewTest@123456',
        confirmPassword: 'NewTest@123456'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Current password is incorrect');
    });

    test('should not change password if new passwords do not match', async () => {
      const passwordData = {
        currentPassword: 'Test@123456',
        newPassword: 'NewTest@123456',
        confirmPassword: 'DifferentPassword123'
      };

      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
    });
  });

  describe('Integration Tests', () => {
    test('should complete full authentication flow', async () => {
      const userData = {
        email: 'integration@example.com',
        password: 'Integration@123'
      };

      // 1. Register
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(registerResponse.body).toHaveProperty('token');
      const token = registerResponse.body.token;

      // 2. Get profile
      const profileResponse = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(profileResponse.body.user.email).toBe(userData.email);

      // 3. Logout
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // 4. Login again
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send(userData)
        .expect(200);

      expect(loginResponse.body).toHaveProperty('token');
    });
  });
});