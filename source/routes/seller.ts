import express from 'express';
import {getUserContainer} from '../database';
import bodyParser from "body-parser";
import { Company } from '../models/company';
import { Seller } from '../models/seller';
const router = express.Router();

router.use(bodyParser.json());

router.get('/', async (req, res) => {
    const container = await getUserContainer();
    const querySpec = {
        query: "select * from u where u.partitionKey=@partitionKey",
        parameters: [
            {
                name: "@partitionKey",
                value: new Seller().partitionKey
            }
        ]
    };
    
    // // Get items 
    const { resources } = await container.items.query(querySpec).fetchAll();
    console.log(resources.length);
    res.send(resources);
});

router.post('/',  async (req, res) => {
    const container = await getUserContainer();

    try {
        let company = new Company(
            req.body.company.name, 
            req.body.company.registrationNum
            );

        let buyer = new Seller(
            req.body.firstName, 
            req.body.lastName, 
            req.body.birthday, 
            req.body.phoneNumber,
            req.body.email,
            req.body.vat,
            company);
   
       await container.items.create(buyer);

    } catch(e) {
        res.send(500);
    }
    res.sendStatus(200);
});

export default router;