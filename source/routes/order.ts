import express from "express";
import bodyParser from "body-parser";
import {
  createTopic,
  getOrderByTopic,
  sendMessageToTopic,
} from "../hedera/topic";
import { getWallet } from "../hedera/wallet";
import { HederaOrder } from "../hedera/models/hederaOrder";
import { createOrder, getOrderById } from "../services/cosmosdb-queries";
import { OrderUpdate } from "../models/orderUpdate";
import { OrderStatuses } from "../enums/orderStatuses";
import { OrderView } from "../models/order-view";
import dotenv from "dotenv";
dotenv.config();
import {
  AccountId,
  PrivateKey,
  Client,
  TransferTransaction,
  Hbar,
} from "@hashgraph/sdk";

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID as string);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_KEY as string);
const tokenId = process.env.USDC_CONTRACT_ID as string;
const client = Client.forTestnet().setOperator(operatorId, operatorKey);

const router = express.Router();

router.use(bodyParser.json());

async function pay(amount: number, receiver: string) {
  const transaction = await new TransferTransaction()
    .addTokenTransfer(tokenId, operatorId, -amount)
    .addTokenTransfer(tokenId, receiver, amount)
    .freezeWith(client);

  //Sign with the sender account private key
  const signTx = await transaction.sign(operatorKey);

  //Sign with the client operator private key and submit to a Hedera network
  const txResponse = await signTx.execute(client);

  //Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Obtain the transaction consensus status
  const transactionStatus = receipt.status;

  console.log(
    "The transaction consensus status " + transactionStatus.toString()
  );
}

router.put("/:id", async (req, res) => {
  try {
    const wallet = await getWallet();

    let order = await getOrderById(req.params.id);

    let updateStatus: OrderUpdate = req.body.update;

    // To do transfer fiat to USDC to operator account

    if (updateStatus.st == OrderStatuses.PartiallyPaid) {
        //TO DO calculate partial payment
        const payment = Number(updateStatus.m.split(",")[0])
        const receiverId = String(updateStatus.m.split(",")[1])
        await pay(payment, receiverId);
    } else if (updateStatus.st == OrderStatuses.Completed) {
        const payment = Number(updateStatus.m.split(",")[0])
        const receiverId = String(updateStatus.m.split(",")[1])
        await pay(payment, receiverId);
        
    }

    

    await sendMessageToTopic(
        wallet,
        order?.topicId!,
        JSON.stringify(updateStatus)
      );

    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
router.post("/", async (req, res) => {
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

router.get("/:id", async (req, res) => {
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
