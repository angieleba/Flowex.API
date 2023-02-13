import { Company } from "./company";
import { Person } from "./person"

export class Buyer extends Person {
    public partitionKey = "/buyer";

    constructor(
        firstName : string = "", 
        lastName : string = "", 
        birthday : Date = new Date(), 
        phoneNumber : string = "", 
        email : string = "", 
        vat : string = "",
        password: string = "",
        photo: string = "",
        company : Company = new Company()
    ){
        super(firstName, lastName, birthday, phoneNumber, email, vat, password,photo, company);
    }
}