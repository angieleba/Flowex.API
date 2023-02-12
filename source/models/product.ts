import { ProcessingType } from "../enums/processingType";
import { QualityAttributes } from "../enums/qualityAttributes";
import { Shade } from "../enums/shade";
import { WoodType } from "../enums/WoodType";
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
    photo: string;
    quantity: number;
    public partitionKey = "/product";

    constructor() {
        super();
        this.treeName = "";
        this.woodType = WoodType.NotDefined;
        this.qualityAttributes = new Map<QualityAttributes, string>();
        this.processingType = ProcessingType.Undefined;
        this.shade = Shade.Light;
        this.location = "";
        this.priceUnit = 0;
        this.currency = "euro";
        this.photo = "";
        this.quantity = 0;
    }
}