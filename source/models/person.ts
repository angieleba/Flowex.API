
import { Company } from "./company";
import { Item } from "./item";

export class Person extends Item {
    firstName: string;
    lastName: string;
    birthday: Date;
    phoneNumber: string;
    email: string;
    vat: string;
    password:string;
    company : Company;
    photo : string;
    anonymousAddress: string;
    publicKey : string;
    privateKey : string;
    constructor(
        firstName : string = "", 
        lastName : string = "", 
        birthday : Date = new Date(), 
        number : string = "", 
        email : string = "", 
        vat : string = "",
        password: string = "",
        photo: string = "",
        company : Company = new Company()) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthday = birthday;
        this.phoneNumber = number;
        this.email = email;
        this.vat = vat;
        this.password = password;
        this.photo = photo;
        this.company = company;
    }


    isValid() : boolean {

        return this.isNotNullEmptyOrUndefined(this.firstName) &&
        this.isNotNullEmptyOrUndefined(this.lastName) &&
        this.isNotNullEmptyOrUndefined(this.phoneNumber) &&
        this.isNotNullEmptyOrUndefined(this.email) &&
        this.isNotNullEmptyOrUndefined(this.vat) && //TODO VALIDATE VAT
        this.isNotNullEmptyOrUndefined(this.password) &&
        this.isNotNullEmptyOrUndefined(this.company.name) &&
        this.isNotNullEmptyOrUndefined(this.company.registrationNumber)
    }

    isNotNullEmptyOrUndefined(value : string) : boolean {
       var val = (value != null && value.length > 0) ? true : false;
       return val;
    }
}