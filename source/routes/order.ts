import express from 'express';
import bodyParser from "body-parser";
import { createTopic, getOrderByTopic, sendMessageToTopic } from '../hedera/topic';
import { getWallet } from '../hedera/wallet';
import { HederaOrder } from '../hedera/models/hederaOrder';
import { createOrder, getOrderById } from '../services/cosmosdb-queries';
import { OrderUpdate } from '../models/orderUpdate';
import { OrderStatuses } from '../enums/orderStatuses';
import { OrderView } from '../models/order-view';
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.use(bodyParser.json());

router.put('/:id', async (req, res) => {

    try {
        const wallet = await getWallet();

        let order = await getOrderById(req.params.id);

        let updateStatus: OrderUpdate = req.body.update;

        await sendMessageToTopic(wallet, order?.topicId!, JSON.stringify(updateStatus));

        if (updateStatus.st == OrderStatuses.PartiallyPaid) {
            //TODO: send money in stable coin 
            //TODO: calculate pecentage 
        }

        if (updateStatus.st == OrderStatuses.PartiallyPaid) {
            //TODO: send the rest of the money
        }

        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})
router.post('/', async (req, res) => {
    try {
        const wallet = await getWallet();
        const topic = await createTopic(wallet);

        await createOrder(topic.toString(), req.body.buyerId, req.body.sellerId); //Creating a mapping in cosmosDB to be able to query later by topicID

        var hederaOrder = new HederaOrder();
        hederaOrder.pId = req.body.order.productId;
        hederaOrder.c = req.body.order.cost;
        hederaOrder.date = new Date();
        hederaOrder.dest = req.body.order.destinationAddress;
        hederaOrder.maxt = req.body.order.maxConfirmationTime;
        hederaOrder.maxdd = req.body.order.maxDeliveryDate;
        hederaOrder.q = req.body.order.quantity;

        await sendMessageToTopic(wallet, topic, JSON.stringify(hederaOrder));

        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.get('/:id', async (req, res) => {
    try {
        let topic = await getOrderById(req.params.id);
        if (!topic) {
            res.sendStatus(500);
        }

        let orderView: OrderView = await getOrderByTopic(topic!.topicId);
        res.send(orderView);
    } catch (e) {
        res.sendStatus(500);
    }
});

export default router;