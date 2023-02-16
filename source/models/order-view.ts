import { OrderStatuses } from "../enums/orderStatuses";
import { Product } from "./product";

export class OrderView {
    product : Product;
    topicId : string; //orderId
    quantity : number;
    cost: number;
    status: OrderStatuses;
    creationDate: Date;
    maxConfirmationTime: Date;
    maxDeliveryDate: Date;
    destinationAddress: string;
    messages : string[];

    constructor(
        product : Product, 
        topicId : string, 
        quantity : number, 
        cost: number, 
        status: OrderStatuses, 
        creationDate: Date, 
        maxConfirmationTime: Date, 
        maxDeliveryDate: Date,
        destinationAddress: string,
        messages : string[]) {
            this.product = product;
            this.topicId = topicId;
            this.quantity = quantity;
            this.cost = cost;
            this.status = status;
            this.creationDate = creationDate;
            this.maxConfirmationTime = maxConfirmationTime;
            this.maxDeliveryDate = maxDeliveryDate;
            this.destinationAddress = destinationAddress;
            this.messages = messages;
    }
}