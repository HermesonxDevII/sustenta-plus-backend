declare namespace Express {
    export interface AuthUser {
        id: number;
        ability: string;
    }
    
    export interface Request {
        user: AuthUser;
    }
}