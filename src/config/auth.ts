import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { getToken } from "../functions/users";
import { systemError } from '../functions/errors';

import { User } from '../models';

interface AuthData {
    id: string,
    role: string,
    exp: number,
    iat: number
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = getToken(req);
        if (token) {
            const authData: AuthData = jwt.verify(token as string, process.env.JWT_KEY as string) as AuthData;
            req.user = authData;
            next();
        } else {
            next(systemError('Access token needed to access this route.', 403));
        }
    } catch (e) {
        next(systemError(e.message, 401));
    }
}