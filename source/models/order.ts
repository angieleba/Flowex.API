import { Item } from "./item";


export class Order extends Item {
    public partitionKey = "/orders";
    topicId : string;
    buyerId : string;
    supplierId : string;

    constructor(topicId : string, buyerId: string, supplierId : string) {
        super();
        this.topicId = topicId;
        this.buyerId = buyerId;
        this.supplierId = supplierId;
    }
}