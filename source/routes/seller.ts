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

//GET SELLER BY ID
router.get('/:id', async (req, res) => {
    try {
        const container = await getUserContainer();

        const querySpec = {
            query: "select * from u where u.id=@id",
            parameters: [
                {
                    name: "@id",
                    value: req.params.id
                }
            ]
        };

        const { resources } = await container.items.query(querySpec).fetchAll();

        if (resources.length == 1) {
            res.send(resources[0]);
        } 

        if(resources.length == 0) {
            res.sendStatus(404);
        }

        if(resources.length > 1) {
            res.sendStatus(500);
        }

    } catch (e) {
        res.sendStatus(500);
    }
});

export default router;