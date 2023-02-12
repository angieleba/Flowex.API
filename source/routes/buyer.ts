import express from 'express';
import { getUserContainer } from '../database';
import bodyParser from "body-parser";
import { Company } from '../models/company';
import { Buyer } from '../models/buyer';
import createhederaAccount from '../hedera/accounts';

const router = express.Router();

router.use(bodyParser.json());

//GET ALL BUYERS
router.get('/', async (req, res) => {
    try {
        const container = await getUserContainer();

        const querySpec = {
            query: "select * from u where u.partitionKey=@partitionKey",
            parameters: [
                {
                    name: "@partitionKey",
                    value: new Buyer().partitionKey
                }
            ]
        };
        const { resources } = await container.items.query(querySpec).fetchAll();

        res.send(resources);

    } catch (e) {
        res.sendStatus(500);
    }
});

//GET BUYER BY ID
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

//CREATE BUYER
router.post('/', async (req, res) => {
    const container = await getUserContainer();
    try {
        let company = new Company(
            req.body.company.name,
            req.body.company.registrationNumber
        );

        let buyer = new Buyer(
            req.body.firstName,
            req.body.lastName,
            req.body.birthday,
            req.body.phoneNumber,
            req.body.email,
            req.body.vat,
            req.body.password,
            req.body.photo,
            "address", //TODO: Get hedera
            company);

        if(buyer.isValid()) {
            const querySpec = {
                query: "select * from u where u.email=@email",
                parameters: [
                    {
                        name: "@email",
                        value: req.body.email
                    }
                ]
            };
            const { resources } = await container.items.query(querySpec).fetchAll();
            if (resources.length > 0){
                res.sendStatus(422);
            } else {

                const accountId = await createhederaAccount();
                buyer.anonymousAddress = accountId.toString();
                
                await container.items.create(buyer);
                res.sendStatus(200);
            }
        } else {
            res.sendStatus(403);
        }
    } catch (e) {
        res.sendStatus(500);
    }
});

export default router;