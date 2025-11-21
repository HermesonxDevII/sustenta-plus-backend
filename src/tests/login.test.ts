import supertest from 'supertest';
import app from '../server';
import { testUser } from './globalSetup';

const request = supertest(app); 
const API_PREFIX = '/api';

describe('POST /api/login', () => {
  it('deve logar um usuário existente e retornar um token', async () => {
    const response = await request
      .post(`${API_PREFIX}/login`)
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe(testUser.email);
    expect(response.body.user.ability).toBe('user');
  });

  it('deve retornar 401 para senha incorreta', async () => {
    const response = await request
      .post(`${API_PREFIX}/login`)
      .send({
        email: testUser.email,
        password: 'senha-errada',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Credenciais inválidas.');
  });

  it('deve retornar 401 para e-mail inexistente', async () => {
    const response = await request
      .post(`${API_PREFIX}/login`)
      .send({
        email: 'naoexiste@sustenta.com',
        password: testUser.password,
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Credenciais inválidas.');
  });
});