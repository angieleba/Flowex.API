import { Company } from "./company";
import { Person } from "./person";

export class Supplier extends Person {
    public partitionKey = "/seller";

    constructor(
        firstName : string = "", 
        lastName : string = "", 
        birthday : Date = new Date(), 
        phoneNumber : string = "", 
        email : string = "", 
        vat : string = "",
        password: string = "",
        photo: string = "",
        anonymousAddress: string = "",
        company : Company = new Company()
    ){
        super(firstName, lastName, birthday, phoneNumber, email, vat, password,photo, anonymousAddress, company);
    }
}