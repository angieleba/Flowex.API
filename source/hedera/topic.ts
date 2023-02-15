import { AccountId, Client, LocalProvider, PrivateKey, SubscriptionHandle, TopicCreateTransaction, TopicId, TopicMessageQuery, TopicMessageSubmitTransaction, Wallet } from "@hashgraph/sdk";
import { create } from "domain";
import { Order } from "../models/order";
import { OrderView } from "../viewModels/orderView";


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

export async function sendMessageToTopic(wallet: Wallet, topicId: TopicId, message: string) {
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

export function getOrderMessages(topicId: string) : string[] {
    let client;
    let messages : string[] = [];
    try {
        client = Client.forName(process.env.HEDERA_NETWORK!).setOperator(
            AccountId.fromString(process.env.OPERATOR_ID!),
            PrivateKey.fromString(process.env.OPERATOR_KEY!)
        );
    } catch (error) {
        throw new Error(
            "Environment variables HEDERA_NETWORK, OPERATOR_ID, and OPERATOR_KEY are required."
        );
    }
    try {
        let topic = new TopicMessageQuery()
            .setCompletionHandler(() => {
                console.log("done");
                return messages;
            })
            .setErrorHandler((message, error) => {
                console.log(error);
                console.log(message);
            })
            .setTopicId(topicId)
            .setStartTime(0)
            .subscribe(
                client,
                null,
                (message) => {
                    let msg = Buffer.from(message.contents).toString("utf8");
                    messages.push(msg);
                    console.log(msg);
                });
             
        
            return messages;
            //query.unsubscribe();
    } catch (e) {
        throw new Error("Failed to retrieve Hedera messages for topic " + topicId);
    }
}