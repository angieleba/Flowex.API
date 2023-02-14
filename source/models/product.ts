import { ProcessingType } from "../enums/processingType";
import { QualityAttributes } from "../enums/qualityAttributes";
import { Shade } from "../enums/shade";
import { WoodType } from "../enums/woodType";
import { Item } from "./item";


export class Product extends Item {
    treeName: string;
    woodType : WoodType;
    qualityAttributes: Map<QualityAttributes, string>;
    processingType: ProcessingType;
    shade : Shade;
    location: string;
    priceUnit: number;
    currency: string;
    photo: string; //TODO: how to store photos
    quantity: number;
    public partitionKey = "/product";

    constructor() {
        super();
        this.treeName = "Wood";
        this.woodType = WoodType.NotDefined;
        this.qualityAttributes = new Map<QualityAttributes, string>();
        this.processingType = ProcessingType.Undefined;
        this.shade = Shade.Light;
        this.location = "we dont know";
        this.priceUnit = 0;
        this.currency = "euro";
        this.photo = "";
        this.quantity = 0;
    }


    isValid() : boolean {
        return this.isNotNullEmptyOrUndefined(this.treeName) && this.isNotNullEmptyOrUndefined(this.location)
        && this.isNotNullEmptyOrUndefined(this.photo); //TODO: do validation for all fields
    }

    isNotNullEmptyOrUndefined(value : string) : boolean {
        console.log(value);
       var val = (value != null && value.length > 0) ? true : false;
       return val;
    }
}