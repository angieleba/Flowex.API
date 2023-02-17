import { Client, LocalProvider, Wallet } from "@hashgraph/sdk";

export async function getWallet() : Promise<Wallet> {
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

    return wallet;
}

export async function getProductSmartContractWallet() : Promise<Wallet> {
    var client = Client.forTestnet();
    if (process.env.PRODUCT_OPERATOR_ID == null || process.env.PRODUCT_OPERATOR_KEY == null) {
        throw new Error(
            "Environment variables PRODUCT_OPERATOR_ID, and PRODUCT_OPERATOR_KEY are required."
        );
    }

    const wallet = new Wallet(
        process.env.PRODUCT_OPERATOR_ID,
        process.env.PRODUCT_OPERATOR_KEY,
        new LocalProvider({client}));
    

    return wallet;
}