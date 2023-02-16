import express from 'express';
import { getUserContainer } from '../database';
import bodyParser from "body-parser";
import { Company } from '../models/company';
import { Supplier } from '../models/supplier';
import createHederaAccount from '../hedera/accounts';
import { OrderStatuses } from '../enums/orderStatuses';
import { OrderView } from '../models/order-view';
import { Product } from '../models/product';
import { getUserById, getUserOrders } from '../services/cosmosdb-queries';
import { TopicMessageQuery } from '@hashgraph/sdk';
import { getOrderByTopic } from '../hedera/topic';
const router = express.Router();

router.use(bodyParser.json());

router.get('/', async (req, res) => {
    const container = await getUserContainer();
    const querySpec = {
        query: "select * from u where u.partitionKey=@partitionKey",
        parameters: [
            {
                name: "@partitionKey",
                value: new Supplier().partitionKey
            }
        ]
    };

    // // Get items 
    const { resources } = await container.items.query(querySpec).fetchAll();
    console.log(resources.length);
    res.send(resources);
});

router.post('/', async (req, res) => {

    try {
        const container = await getUserContainer();

        let company = new Company(
            req.body.company.name,
            req.body.company.registrationNumber
        );

        let seller = new Supplier(
            req.body.firstName,
            req.body.lastName,
            req.body.birthday,
            req.body.phoneNumber,
            req.body.email,
            req.body.vat,
            req.body.password,
            req.body.photo,
            company);

        if (seller.isValid()) {
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
            if (resources.length > 0) {
                res.send(422);
            } else {
                const hederaAccount = await createHederaAccount();
                seller.anonymousAddress = hederaAccount.accountId.toString();
                seller.publicKey = hederaAccount.publicKey;
                seller.privateKey = hederaAccount.privateKey;
                await container.items.create(seller);
                res.sendStatus(200);
            }
        } else {
            res.sendStatus(403);
        }

    } catch (e) {
        res.send(500);
    }
});

//GET SELLER BY ID
router.get('/:id', async (req, res) => {
    try {

        let resources = await getUserById(req.params.id);
    
        if (!resources) {
            res.sendStatus(404);
        }

        if (resources != null && resources.length == 1) {
            res.send(resources[0]);
        }

        if (resources != null && resources.length > 1) {
            res.sendStatus(500);
        }

    } catch (e) {
        res.sendStatus(500);
    }
});

router.get('/:id/products', async (req, res) => {
    try {

        let supplier: Supplier | undefined = undefined;
        let resources = await getUserById(req.params.id);

        if(!resources) {
            res.sendStatus(404);
        }
        if (resources.length == 1) {
            supplier = resources[0];
            const anonymousAddress = supplier?.anonymousAddress;

            //TODO: Use hedera address to take products from smart contract
            res.send("LIST OF PRODUCTS OF SUPPLIER");
        }

        if (resources.length == 0) {
            res.sendStatus(404);
        }

        if (resources.length > 1) {
            res.sendStatus(500);
        }
    } catch (e) {
        res.sendStatus(500);
    }
});

router.get('/:id/orders', async (req, res) => {
    let finalOrders : OrderView[] = [];

     try {

         let topics = await getUserOrders(req.params.id, true);
         for (let i = 0; i < topics.length; i++) {
            let orderView : OrderView = await getOrderByTopic(topics[i].topicId);
            finalOrders.push(orderView);
         }
        
         res.send(finalOrders);

    } catch (e) {
        res.sendStatus(500);
    }
});

export default router;