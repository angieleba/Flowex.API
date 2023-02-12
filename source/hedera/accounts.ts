import { AccountCreateTransaction, AccountId, Hbar, LocalProvider, PrivateKey, Wallet } from "@hashgraph/sdk";

/**
 * createAccount in Hedera
 */
async function createhederaAccount() : Promise<AccountId> {
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
        .setInitialBalance(new Hbar(10)) // 10 h
        .setKey(newKey.publicKey)
        .freezeWithSigner(wallet);

    transaction = await transaction.signWithSigner(wallet);

    const response = await transaction.executeWithSigner(wallet);

    const receipt = await response.getReceiptWithSigner(wallet);

    if(receipt.accountId === null) {
        throw new Error("Hedera account id is null.");
    }

    console.log(`account id = ${receipt.accountId?.toString()}`);

    return receipt.accountId!;
    
}

export default createhederaAccount;