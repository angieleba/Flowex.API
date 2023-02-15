import {TopicCreateTransaction, TopicId, TopicMessageSubmitTransaction, Wallet } from "@hashgraph/sdk";
import axios from "axios";
import * as dotenv from 'dotenv';
import { OrderStatuses } from "../enums/orderStatuses";
import { OrderUpdate } from "../models/orderUpdate";
import { Product } from "../models/product";
import { OrderView } from "../viewModels/orderView";
import { HederaOrder } from "./models/hederaOrder";

dotenv.config();

export async function createTopic(wallet: Wallet): Promise<TopicId> {
    // create topic
    let transaction = await new TopicCreateTransaction().freezeWithSigner(
        wallet
    );
    transaction = await transaction.signWithSigner(wallet);
    const createResponse = await transaction.executeWithSigner(wallet);
    const createReceipt = await createResponse.getReceiptWithSigner(wallet);

    if (!createReceipt) {
        throw Error("Error creating topic");
    }
    console.log(`topic id = ${createReceipt.topicId!.toString()}`);

    return createReceipt.topicId!;
}

export async function sendMessageToTopic(wallet: Wallet, topicId: TopicId | string, message: string) {
    // send one message
    try {
        let transaction = await new TopicMessageSubmitTransaction({
            topicId: topicId,
            message: message,
        }).freezeWithSigner(wallet);
        transaction = await transaction.signWithSigner(wallet);
        const sendResponse = await transaction.executeWithSigner(wallet);

        const sendReceipt = await sendResponse.getReceiptWithSigner(wallet);

        console.log(
            `topic sequence number = ${sendReceipt.topicSequenceNumber!.toString()}`
        );
    } catch (e) {
        throw new Error("Failure sending messages to topic " + topicId.toString());
    }
}

export async function getOrderByTopic(topicId: string) : Promise<OrderView> {
    const response = await axios({
        url: `${process.env.HEDERA_MIRROR_NODE_URL}/api/v1/topics/${topicId}/messages`,
        method: "get",
    });

    let messages : string [] = [];
    let orderJsonParsed : HederaOrder = JSON.parse(Buffer.from(response.data.messages[0].message, 'base64').toString('utf-8'));
    let orderStatus = OrderStatuses.Created;
    for (let i = 1; i < response.data.messages.length; i++) {
        let m = response.data.messages[i];
        let statusMsg : OrderUpdate = JSON.parse(Buffer.from(m.message, 'base64').toString('utf-8'));
        orderStatus = statusMsg.st;
        messages.push(statusMsg.m);
    }

    let order = new OrderView(
        new Product(), //TODO: get from smart contract
        topicId, 
        orderJsonParsed.q, 
        orderJsonParsed.c, 
        orderStatus, 
        orderJsonParsed.date, 
        orderJsonParsed.maxt, 
        orderJsonParsed.maxdd, 
        orderJsonParsed.dest, 
        messages);

        console.log("Our order: ", order);
        return order;
}