const request = require('supertest');
const app = require('../app'); // Supondo que app.js é onde sua aplicação express é definida
const Customer = require('../models/customer');
const sequelize = require('../config/database');

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Recria o banco de dados para testes
});

afterAll(async () => {
  await sequelize.close();
});

describe('Customer API', () => {
  let token;

  it('should register a new customer', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password123',
        email: 'testuser@example.com',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should login a customer', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    token = response.body.token;
  });

  it('should update customer profile', async () => {
    const response = await request(app)
      .put('/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'newemail@example.com',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', 'newemail@example.com');
  });

  it('should delete a customer', async () => {
    const response = await request(app)
      .delete('/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});
