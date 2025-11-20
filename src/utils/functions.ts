import jwt from 'jsonwebtoken';

export const getToken = (id: number, ability: string): string => {
    const JWT_SECRET = process.env.JWT_SECRET;
          
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET não está definido no ambiente.");
    }

    return jwt.sign({ id: id, ability: ability }, JWT_SECRET, { expiresIn: '1y' });
}