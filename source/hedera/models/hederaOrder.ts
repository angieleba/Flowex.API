
export class HederaOrder {
    pId : string; //productId
    q : number; //quantity
    c: number; //cost
    date: Date; //creatioDate
    maxt: Date; //maxConfirmationTime
    maxdd: Date; //maxDeliveryDate
    dest: string;

    constructor() {
    }
}