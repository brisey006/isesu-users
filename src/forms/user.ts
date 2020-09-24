import { FormError } from '../interfaces';
import bcrypt from 'bcryptjs';

export default class UserForm {
    private _errors: FormError[] = [];

    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    
    get errors(): FormError[] {
        return this._errors;
    }

    get data() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
        };
    }
    
    constructor( { firstName, lastName, email, password, passwordConfirmation } : 
        { firstName: string, lastName: string, email: string, password: string, passwordConfirmation: string }) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.passwordConfirmation = passwordConfirmation;
    }

    //Validate Form
    public isValid(): boolean {
        const errors: FormError[] = [];
        const { firstName, lastName, email, password, passwordConfirmation } = this;

        //Validating first name
        if (!firstName) {
            errors.push({ field: 'firstName', message: 'First name is required.' });
        }

        //Validating last name
        if (!lastName) {
            errors.push({ field: 'lastName', message: 'Last name is required.' });
        }

        //Validating email address
        if (!email) {
            errors.push({ field: 'email', message: 'Email is required.' });
        } else {
            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
                errors.push({ field: 'email', message: 'Email provided is invalid.' });
            }
        }

        //Validating password
        if (!password) {
            errors.push({ field: 'password', message: 'Password is required.' });
        } else {
            if (password.length < 6) {
                errors.push({ field: 'password', message: 'Password must be 6 or more characters.' });
            }
        }

        //Validating password confirmation
        if (!passwordConfirmation) {
            errors.push({ field: 'passwordConfirmation', message: 'Password confirmation is required.' });
        } else {
            if (password != passwordConfirmation) {
                errors.push({ field: 'password', message: 'Passwords do not match.' });
            }
        }
        
        if (errors.length > 0) {
            this._errors = errors;
            return false;
        } else {
            this._errors = [];
            return true;
        }
    }

    public hashPassword() {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(this.password, salt);
        this.password = hash;
    }
}