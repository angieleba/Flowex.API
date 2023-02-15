
export class HederaOrder {
    productId : string;
    quantity : number;
    cost: number;
    creationDate: Date;
    maxConfirmationTime: Date;
    maxDeliveryDate: Date;
    destinationAddress: string;
    buyerAnonymousAddress: string;
    supplierAnonymousAddress: string;

    constructor() {
    }
}