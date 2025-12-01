import { Request } from 'express';

interface JwtPayload {
    id: number;
    ability: string;
    iat?: number;
    exp?: number;
}

export interface AuthRequest extends Request {
    user?: JwtPayload; 
}