import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models';

const SALT_ROUNDS = 10; 

class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    const { name, email, password, cpf } = req.body;

    if (!name || !email || !password || !cpf) {
      return res
        .status(400)
        .json({
            error: 'Todos os campos obrigatórios (nome, email, senha, cpf) devem ser fornecidos.'
        });
    }

    try {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(409).json({ error: 'Este e-mail já está registrado.' });
      }

      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

      const DEFAULT_ROLE_ID = 1;

      const user = await User.create({
        name,
        email,
        password: password_hash,
        cpf,
        role_id: DEFAULT_ROLE_ID,
      });

      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        created_at: user.created_at,
      };

      return res.status(201).json({ 
        message: 'Usuário registrado com sucesso!', 
        user: userResponse 
      });

    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return res.status(500).json({ error: 'Erro interno do servidor ao tentar registrar.' });
    }
  }
}

export default new AuthController();