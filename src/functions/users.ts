import { Request } from 'express';

export const getToken = (req: Request) => {
    const bearerHeader: string = req.headers['authorization'] || '';
    if (typeof bearerHeader == undefined) {
        return null;
    } else if (bearerHeader.indexOf(' ') > -1) {
        return bearerHeader.split(' ')[1];
    } else {
        return bearerHeader;
    }
} 