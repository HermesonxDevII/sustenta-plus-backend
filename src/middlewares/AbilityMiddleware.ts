import { Response, NextFunction } from 'express';
import { AuthRequest } from '../utils/interfaces';
import { hasAbility } from '../utils/functions';

export const AbilityMiddleware = (requiredAbility: string) => {

    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.ability)
            return res.status(401).json({ error: 'Autenticação requerida.' });

        const hasPermission = hasAbility(req.user.ability, requiredAbility); 

        if (!hasPermission)
            return res.status(403).json({ error: `Acesso negado. Requer habilidade: ${requiredAbility}.` });

        return next();
    };
};