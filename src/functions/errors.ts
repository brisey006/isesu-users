import { FormError } from '../interfaces';
import { ErrorHandler, FormErrorHandler } from '../errors';

export const formError = (errors: FormError[]) => {
    return new FormErrorHandler(406, errors);
}

export const systemError = (message: string, status?: number) => {
    return new ErrorHandler(status || 500, message);
}