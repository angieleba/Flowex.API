import { AccountCreateTransaction, AccountId, Client, Hbar, LocalProvider, PrivateKey, Wallet } from "@hashgraph/sdk";
import dotenv from "dotenv";

dotenv.config();

/**
 * createAccount in Hedera
 */
async function createHederaAccount() : Promise<any> {
    if (process.env.OPERATOR_ID == null || process.env.OPERATOR_KEY == null) {
        throw new Error(
            "Environment variables OPERATOR_ID, and OPERATOR_KEY are required."
        );
    }

    const wallet = new Wallet(
        process.env.OPERATOR_ID,
        process.env.OPERATOR_KEY,
        new LocalProvider()
    );

    const newKey = PrivateKey.generate();

    console.log(`private key = ${newKey.toString()}`);
    console.log(`public key = ${newKey.publicKey.toString()}`);

    let transaction = await new AccountCreateTransaction()
        .setKey(newKey.publicKey)
        .freezeWithSigner(wallet);

    transaction = await transaction.signWithSigner(wallet);

    const response = await transaction.executeWithSigner(wallet);

    const receipt = await response.getReceiptWithSigner(wallet);

    if(receipt.accountId === null) {
        throw new Error("Hedera account id is null.");
    }

    console.log(`account id = ${receipt.accountId?.toString()}`);

    return {
        accountId : receipt.accountId,
        publicKey : newKey.publicKey.toString(),
        privateKey : newKey.toString()
    };
    
}

export default createHederaAccount;