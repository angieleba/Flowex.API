import { Company } from "./company";
import { Person } from "./person";

export class Seller extends Person {
    public partitionKey = "/seller";

    constructor(
        firstName : string = "", 
        lastName : string = "", 
        birthday : Date = new Date(), 
        phoneNumber : string = "", 
        email : string = "", 
        vat : string = "",
        company : Company = new Company()
    ){
        super(firstName, lastName, birthday, phoneNumber, email, vat, company);
    }
}