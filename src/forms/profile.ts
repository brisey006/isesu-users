import { FormError } from '../interfaces';

export default class ProfileForm {
    private _errors: FormError[] = [];

    gender: string;
    phoneNumber: string;
    address: string;
    birthDay: string;
    
    get errors(): FormError[] {
        return this._errors;
    }

    get data() {
        return {
            gender: this.gender,
            phoneNumber: this.phoneNumber,
            address: this.address,
            birthDay: this.birthDay,
        };
    }
    
    constructor( { gender, phoneNumber, address, birthDay } : 
        { gender: string, phoneNumber: string, address: string, birthDay: string }) {
        this.gender = gender;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.birthDay = birthDay;
    }
}