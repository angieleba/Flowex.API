import { Item } from "./item";


export class Order extends Item {
    public partitionKey = "/orders";
    topicId : string;
}