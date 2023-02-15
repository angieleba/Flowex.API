
export class HederaOrder {
    productId : string;
    quantity : number;
    amount: number;
    creationDate: Date;
    maxConfirmationTime: Date;
    maxDeliveryDate: Date;
    destinationAddress: string;
    buyerAnonymousAddress: string;
    supplierAnonymousAddress: string;

    constructor() {
    }
}