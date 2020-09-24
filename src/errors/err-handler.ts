import { ResponseError, FormError } from '../interfaces';

class FormErrorHandler extends Error {
    status: number;
    constructor (status: number, message: FormError[]) {
        super();
        this.status = status;
        this.message = JSON.stringify(message);
    }
}

class ErrorHandler extends Error {
    status: number;
    constructor (status: number, message: string) {
        super(message);
        this.status = status;
        this.message = JSON.stringify([message]);
    }
}

export {
    FormErrorHandler,
    ErrorHandler
}