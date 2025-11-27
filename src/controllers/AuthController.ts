import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, Role } from '../models';
import { getToken } from '../utils/functions';

const SALT_ROUNDS = 10; 

class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    const {
      name,
      email,
      password,
      cpf,
      phone,
      role_id
    } = req.body;

    if (!name || !email || !password || !cpf || !role_id)
      return res.status(400).json({ error: 'Campos obrigatórios ausentes (nome, email, senha, cpf, role_id).' });

    try {
      const userExists = await User.findOne({ where: { email } });

      if (userExists)
        return res.status(409).json({ error: 'Este e-mail já está registrado.' });

      const role = await Role.findByPk(role_id);

      if (!role || role.ability === 'admin')
        return res.status(403).json({ error: 'Role inválida para registro público.' });

      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

      const user = await User.create({
        name,
        email,
        password: password_hash,
        cpf,
        phone,
        role_id,
      });

      const token = getToken(user.id, role.ability);

      return res.status(201).json({ 
        message: 'Usuário registrado com sucesso!', 
        user: {
          name: user.name,
          email: user.email,
          ability: role.ability,
        },
        token: token
      });

    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return res
        .status(500)
        .json({
          error: 'Erro interno do servidor ao tentar registrar.'
        });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'E-mail e senha devem ser fornecidos.' });

    try {
      const user = await User.findOne({ 
        where: { email },
        include: [{
          model: Role,
          as: 'role'
        }]
      });

      if (!user)
        return res.status(401).json({ error: 'Credenciais inválidas.' });

      const passwordMatch = await bcrypt.compare(password, user.password);
      const ability = user.role?.ability;

      if (!passwordMatch)
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      
      if (user.status === false || !ability)
        return res.status(403).json({ error: 'Sua conta está inativa.' });

      const token = getToken(user.id, ability);
      
      return res.status(200).json({ 
        message: 'Usuário logado com sucesso!', 
        user: {
          name: user.name,
          email: user.email,
          ability: ability,
        },
        token: token 
      });

    } catch (error) {
      console.error('Erro ao tentar autenticar usuário:', error);
      return res.status(500).json({ error: 'Erro interno do servidor ao tentar autenticar.' });
    }
  }
}

export default new AuthController();