import express from 'express';
import { getUserContainer } from '../database';
import bodyParser from "body-parser";
import { Company } from '../models/company';
import { Supplier } from '../models/supplier';
import createHederaAccount from '../hedera/accounts';
import { OrderStatuses } from '../enums/orderStatuses';
import { OrderView } from '../viewModels/orderView';
import { Product } from '../models/product';
import { getUserById, getUserOrders } from '../services/generic';
import { TopicMessageQuery } from '@hashgraph/sdk';
import { getOrderMessages } from '../hedera/topic';
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
    let finalOrders : string[] = [];

     try {
        //  let orders = await getUserOrders(req.params.id, true);
        //  orders.forEach(order => {
        //     finalOrders = getOrderMessages(order.topicId);
        //     console.log("final order", finalOrders);
        //  });
        
        //  res.send(finalOrders);

        var orders = [
            new OrderView(new Product(), "1", 10, 50, OrderStatuses.Created, new Date(), new Date(), new Date(), "strssse 75",
                [
                    "Order with id x was created on 13 may 2023."
                ]),
            new OrderView(new Product(), "2", 10, 50, OrderStatuses.Approved, new Date(), new Date(), new Date(), "strssse 75",
                [
                    "Order with id x was created on 13 may 2023.",
                    "Order x was approved by the seller on 12 May 2023",
                ]),
            new OrderView(new Product(), "3", 10, 50, OrderStatuses.Rejected, new Date(), new Date(), new Date(), "strssse 75",
                [
                    "Order with id x was created on 13 may 2023.",
                    "Order x was rejected by the seller on 14 may 2023",
                ]),
            new OrderView(new Product(), "4", 10, 50, OrderStatuses.PartiallyPaid, new Date(), new Date(), new Date(), "strssse 75",
                [
                    "Order with id x was created on 13 may 2023.",
                    "Order x was approved by the seller",
                    "Buyer paid 10% of the total amount"
                ]),

            new OrderView(new Product(), "5", 10, 50, OrderStatuses.InElaboration, new Date(), new Date(), new Date(), "strssse 75",
                [
                    "Order with id x was created on 13 may 2023.",
                    "Order x was approved by the seller",
                    "Buyer paid 10% of the total amount",
                    "Order is being prepared"
                ]),
            new OrderView(new Product(), "6", 10, 50, OrderStatuses.InTransit, new Date(), new Date(), new Date(), "strssse 75",
                [
                    "Order with id x was created on 13 may 2023.",
                    "Order x was approved by the seller",
                    "Buyer paid 10% of the total amount",
                    "Order is being prepared",
                    "Order has been shipped on the 15th of May 2023"
                ]),
            new OrderView(new Product(), "7", 10, 50, OrderStatuses.Delivered, new Date(), new Date(), new Date(), "strssse 75",
                [
                    "Order with id x was created on 13 may 2023.",
                    "Order x was approved by the seller",
                    "Buyer paid 10% of the total amount",
                    "Order is being prepared",
                    "Order has been shipped on the 15th of May 2023",
                    "Supplier confirms he delivered the order"
                ]),
            new OrderView(new Product(), "8", 10, 50, OrderStatuses.Completed, new Date(), new Date(), new Date(), "strssse 75",
                [
                    "Order with id x was created on 13 may 2023.",
                    "Order x was approved by the seller",
                    "Buyer paid 10% of the total amount",
                    "Order is being prepared",
                    "Order has been shipped on the 15th of May 2023",
                    "Supplier confirms he delivered the order",
                    "Buyer x completed the order and sent x amount of money to the supplier."
                ]),
            new OrderView(new Product(), "9", 10, 50, OrderStatuses.Rejected, new Date(), new Date(), new Date(), "strssse 75",
                [
                    "Order with id x was created on 13 may 2023.",
                    "Order x was approved by the seller",
                    "Buyer paid 10% of the total amount",
                    "Order is being prepared",
                    "Order has been shipped on the 15th of May 2023",
                    "Supplier confirms he delivered the order",
                    "Buyer x rejected the payment stating it has not received the delivery."
                ])
        ];
       res.send(orders);

    } catch (e) {
        res.sendStatus(500);
    }
});

export default router;