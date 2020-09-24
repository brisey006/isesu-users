import { FormError } from '../interfaces';
import { error } from 'console';

export default class LoginForm {
    private _errors: FormError[] = [];

    email: string;
    password: string;

    get errors(): FormError[] {
        return this._errors;
    }

    get data() {
        return {
            email: this.email,
            password: this.password
        };
    }

    constructor({ email, password } : { email: string, password: string }) {
        this.email = email;
        this.password = password;
    }

    isValid(): boolean {
        const errors: FormError[] = [];

        //Validating email
        if (!this.email) {
            errors.push({ field: 'email', message: 'Email is required.' });
        }

        //Validating password
        if (!this.password) {
            errors.push({ field: 'password', message: 'Password is required.' });
        }

        if (errors.length > 0) {
            this._errors = errors;
            return false;
        }
        return true;
    }
}