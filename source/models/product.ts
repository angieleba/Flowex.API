
import { Unit } from "../enums/unit";
import { WoodType } from "../enums/woodType";


export class Product {
    productID : string;
    treeType: string;
    location: string;
    woodType : WoodType;
    colour : string;
    isRaw : boolean;
    pricePerUnit: number;
    photo: string; 
    amount: number;
    unit : Unit;
    approved: boolean;

    constructor() {
        this.productID = "";
        this.treeType = "";
        this.location = "";
        this.woodType = WoodType.Undefined;
        this.colour = "";
        this.isRaw = false;
        this.pricePerUnit = 0;
        this.photo = "";
        this.amount = 0;
        this.unit = Unit.CBM;
        this.approved = true;
    }

    isValid() : boolean {
        return this.isNotNullEmptyOrUndefined(this.treeType) && 
        this.isNotNullEmptyOrUndefined(this.location) &&
        this.isNotNullEmptyOrUndefined(this.photo) &&
        this.isNotNullEmptyOrUndefined(this.productID) &&
        this.isNotNullEmptyOrUndefined(this.colour) &&
        this.pricePerUnit > 0 &&
        this.amount > 0 &&
        this.woodType != WoodType.Undefined 
    }

    isNotNullEmptyOrUndefined(value : string) : boolean {
       return (value != null && value.length > 0) ? true : false;
    }
}