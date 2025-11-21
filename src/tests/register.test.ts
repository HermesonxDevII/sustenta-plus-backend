import supertest from 'supertest';
import app from '../server';
import { User } from '../models';
import { testUser, newRegisterUser } from './globalSetup';

const request = supertest(app); 
const API_PREFIX = '/api';

const registerUser = {
  ...testUser,
  email: 'new.register@sustenta.com',
};

describe('POST /api/register', () => {

  it('deve registrar um novo usuário com sucesso', async () => {
    const response = await request
        .post('/api/register')
        .send(newRegisterUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe(registerUser.email);
    expect(response.body.user.ability).toBe('user');

    const createdUser = await User.findOne({ where: { email: registerUser.email } });
    expect(createdUser).not.toBeNull();
  });

  it('deve retornar 409 se o usuário já estiver registrado', async () => {
    const response = await request
      .post(`${API_PREFIX}/register`)
      .send(registerUser); 

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('error', 'Este e-mail já está registrado.');
  });
  
  it('deve retornar 400 se faltar o campo de senha', async () => {
    const { password, ...incompleteUser } = registerUser;
    const response = await request
      .post(`${API_PREFIX}/register`)
      .send(incompleteUser); 

    expect(response.status).toBe(400);
  });

  it('deve retornar 403 se tentar registrar com a role admin', async () => {
    const adminRegister = {
        ...registerUser,
        email: 'admin.blocked@sustenta.com',
        role_id: 1,
    };
    const response = await request
      .post(`${API_PREFIX}/register`)
      .send(adminRegister); 

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error', 'Role inválida para registro público.');
  });
});