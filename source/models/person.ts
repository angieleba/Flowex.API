
import { Company } from "./company";
import { Item } from "./item";

export class Person extends Item {
    firstName: string;
    lastName: string;
    birthday: Date;
    phoneNumber: string;
    email: string;
    vat: string;
    company : Company;
    password: string;
    constructor(
        firstName : string = "", 
        lastName : string = "", 
        birthday : Date = new Date(), 
        number : string = "", 
        email : string = "", 
        vat : string = "",
        password: string = "",
        company : Company = new Company()) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthday = birthday;
        this.phoneNumber = number;
        this.email = email;
        this.vat = vat;
        this.company = company;
        this.password = password;
    }
}