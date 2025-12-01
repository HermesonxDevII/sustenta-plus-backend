import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../utils/interfaces';
import { getJWTSecret } from '../utils/functions';

export const AuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ error: 'Token não fornecido.' });

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token)
        return res.status(401).json({ error: 'Formato do token inválido. Use Bearer.' });

    const JWT_SECRET = getJWTSecret();

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & { id: number, ability: string };
        
        req.user = {
            id: decoded.id,
            ability: decoded.ability,
            iat: decoded.iat,
            exp: decoded.exp
        };

        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
};