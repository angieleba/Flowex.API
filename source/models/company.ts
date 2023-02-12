
export class Company {
    name : string;
    registrationNumber: string;

    constructor(name: string = "", registrationNum:string = "") {
        this.name = name;
        this.registrationNumber = registrationNum;
    }
}