import jwt from 'jsonwebtoken';

export const getJWTSecret = () => {
    const JWT_SECRET = process.env.JWT_SECRET;
          
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET não está definido no ambiente.");
    }

    return JWT_SECRET;
}

export const getToken = (id: number, ability: string): string => {
    const JWT_SECRET = getJWTSecret();

    return jwt.sign({ id: id, ability: ability }, JWT_SECRET, { expiresIn: '1y' });
}

export const hasAbility = (userAbility: string, requiredAbility: string): boolean => {
    return userAbility === requiredAbility;
}