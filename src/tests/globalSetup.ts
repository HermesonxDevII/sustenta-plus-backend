import { User, Role, sequelize } from '../models';

export const testUser = {
  name: 'Teste User',
  email: 'test@sustenta.com',
  password: 'password123',
  cpf: '111.111.111-11',
  role_id: 2,
};

export const newRegisterUser = { 
  name: 'Novo Usuário Teste',
  email: 'novo.usuario.teste@sustenta.com',
  password: 'newpassword456',
  cpf: '999.999.999-99',
  role_id: 2,
};

export async function setupTestEnvironment() {
    await sequelize.sync({ force: true }); 
    
    await Role.bulkCreate([
      { id: 1, name: 'Admin', ability: 'admin' },
      { id: 2, name: 'User', ability: 'user' },
      { id: 3, name: 'Collector', ability: 'collector' },
    ]);

    const passwordHash = await require('bcryptjs').hash(testUser.password, 10);
    await User.create({
        ...testUser,
        password: passwordHash
    });
}

export async function teardownTestEnvironment() {
    await sequelize.close();
}