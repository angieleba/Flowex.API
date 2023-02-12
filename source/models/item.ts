import { v4 as uuidv4 } from 'uuid';

export class Item {
     id : string;
     partitionKey : string;

    constructor() {
        this.id = uuidv4();
        this.partitionKey = "";
    }
}