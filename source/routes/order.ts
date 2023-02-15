import express from 'express';
import bodyParser from "body-parser";
import { getOrdersContainer } from '../database';
import { createTopic, sendMessageToTopic } from '../hedera/topic';
import { getWallet } from '../hedera/wallet';
import { HederaOrder } from '../hedera/models/hederaOrder';
import { Order } from '../models/order';
import dotenv from "dotenv";
import { getOrderById } from '../services/generic';

dotenv.config();

const router = express.Router();

router.use(bodyParser.json());

router.put('/:id',async (req, res) => {
    
    try {
        const wallet = await getWallet();
        let topic = await getOrderById(req.params.id);
        await sendMessageToTopic(wallet, topic, JSON.stringify(req.body.message));
    } catch(e) {
        res.sendStatus(500);
    }
})
router.post('/', async (req, res) => {
    try {
        const wallet = await getWallet();
        const topic = await createTopic(wallet);

        await createOrder(topic.toString(), req.body.buyerId, req.body.sellerId); //Creating a mapping in cosmosDB to be able to query later by topicID

        // var sellerAnonymous = await getUserById(req.body.sellerId);
        // var buyerAnonymous = await getUserById(req.body.buyerId);

        var hederaOrder = new HederaOrder();
        hederaOrder.productId = req.body.order.productId;
        hederaOrder.amount = req.body.order.amount;
        hederaOrder.creationDate = new Date();
        hederaOrder.destinationAddress = req.body.order.destinationAddress;
        hederaOrder.maxConfirmationTime = req.body.order.maxConfirmationTime;
        hederaOrder.maxDeliveryDate = req.body.order.maxDeliveryDate;
        hederaOrder.quantity = req.body.order.quantity;
        // hederaOrder.buyerAnonymousAddress = buyerAnonymous.anonymousAddress;
        // hederaOrder.supplierAnonymousAddress = sellerAnonymous.anonymousAddress;

        await sendMessageToTopic(wallet, topic, JSON.stringify(hederaOrder));

        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(500);
    }
});


async function createOrder(topicId: string, buyerId: string, sellerId: string) {
    try {
        const container = await getOrdersContainer();
        let order = new Order(topicId, buyerId, sellerId);
        await container.items.create(order);
    } catch(e) {
        throw new Error("Failed to create order in cosmosDB");
    }
}

export default router;