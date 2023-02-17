import { Client, ContractCallQuery, ContractExecuteTransaction, ContractFunctionParameters, PrivateKey } from "@hashgraph/sdk";
import { BigNumber } from 'bignumber.js';
import { getProductSmartContractWallet } from "../hedera/wallet";
import * as dotenv from 'dotenv';
import { Product } from "../models/product";
import { v4 as uuidv4 } from 'uuid';
import { convertGuidToInt } from "../services/common";
import { hethers } from "@hashgraph/hethers";
import contractJson from '../smart-contracts/product-smart-contract.json';

dotenv.config();

export async function getProductById(id: string, supplierId : string) {

    var client = Client.forTestnet();
    client.setOperator(process.env.PRODUCT_OPERATOR_ID!, process.env.PRODUCT_OPERATOR_KEY!);

    console.log(contractJson.abi);
    let provider = hethers.getDefaultProvider();
    let contract = new hethers.Contract( process.env.PRODUCT_CONTRACT_ADDRESS!, contractJson.abi, provider);

    var re = await contract.getAllProducts(supplierId, { gasLimit: 300000 });
    console.log("products", re);

    // if (process.env.PRODUCT_CONTRACT_ID == null || process.env.PRODUCT_OPERATOR_ID == null || process.env.PRODUCT_OPERATOR_KEY == null) {
    //     throw new Error(
    //         "Environment variables PRODUCT_CONTRACT_ID, PRODUCT_OPERATOR_ID or PRODUCT_OPERATOR_KEY are required."
    //     );
    // }

    // var client = Client.forTestnet();
    // client.setOperator(process.env.PRODUCT_OPERATOR_ID!, process.env.PRODUCT_OPERATOR_KEY!);

    // const contractCallResult = await new ContractCallQuery()
    //     .setContractId(process.env.PRODUCT_CONTRACT_ID!)
    //     .setGas(100000)
    //     .setFunction("getAllProducts",
    //         new ContractFunctionParameters().addString(supplierId))
    //     .execute(client);

    // if (
    //     contractCallResult.errorMessage != null &&
    //     contractCallResult.errorMessage != ""
    // ) {
    //     throw new Error(`error calling contract: ${contractCallResult.errorMessage}`);
    // }

    // console.log("contract message: ", contractCallResult.getBytes32());
}

export async function createProduct(product: Product, supplierId: string) : Promise<boolean> {
    try {
        if (process.env.PRODUCT_CONTRACT_ID == null || process.env.PRODUCT_OPERATOR_ID == null || process.env.PRODUCT_OPERATOR_KEY == null) {
            throw new Error(
                "Environment variables PRODUCT_CONTRACT_ID, PRODUCT_OPERATOR_ID or PRODUCT_OPERATOR_KEY are required."
            );
        }

        var client = Client.forTestnet();
        client.setOperator(process.env.PRODUCT_OPERATOR_ID!, process.env.PRODUCT_OPERATOR_KEY!);

        const productCreate = await new ContractExecuteTransaction()
            .setContractId(process.env.PRODUCT_CONTRACT_ID!)
            .setGas(10000000)
            .setFunction("addProduct",
                new ContractFunctionParameters()
                    .addString(supplierId)
                    .addUint256(convertGuidToInt(product.productID))
                    .addString(product.treeType)
                    .addString(product.location)
                    .addUint8(product.woodType)
                    .addString(product.colour)
                    .addBool(product.isRaw)
                    .addUint256(product.pricePerUnit)
                    .addString(product.photo)
                    .addUint256(product.amount)
                    .addUint8(product.unit))
            .execute(client);

        //Request the receipt of the transaction
        const receipt = await productCreate.getReceipt(client);

        console.log("receipt", receipt);
        //Get the transaction consensus status
        const transactionStatus = receipt.status;

        console.log("The transaction consensus status for product creation is " + transactionStatus);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function createProductCompany(supplierId: string) : Promise<boolean> {
    try {
        if (process.env.PRODUCT_CONTRACT_ID == null || process.env.PRODUCT_OPERATOR_ID == null || process.env.PRODUCT_OPERATOR_KEY == null) {
            throw new Error(
                "Environment variables PRODUCT_CONTRACT_ID, PRODUCT_OPERATOR_ID or PRODUCT_OPERATOR_KEY are required."
            );
        }

        var client = Client.forTestnet();
        client.setOperator(process.env.PRODUCT_OPERATOR_ID!, process.env.PRODUCT_OPERATOR_KEY!);

        const transaction = await new ContractExecuteTransaction()
                .setContractId(process.env.PRODUCT_CONTRACT_ID!)
                .setGas(100000)
                .setFunction("addCompany", new ContractFunctionParameters().addString(supplierId))
                .execute(client);

        //Request the receipt of the transaction
        const receipt = await transaction.getReceipt(client);

        // //Get the transaction consensus status
        const transactionStatus = receipt.status;

        console.log("The transaction consensus status is " +transactionStatus);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }

}

export async function updateProductSupply(product: Product) {
    var wallet = await getProductSmartContractWallet();

    if (process.env.PRODUCT_CONTRACT_ID == null) {
        throw new Error(
            "Environment variable PRODUCT_CONTRACT_ID are required."
        );
    }

    const contractCallResult = await new ContractCallQuery()
        .setContractId(process.env.PRODUCT_CONTRACT_ID!)
        .setGas(100000)
        .setFunction("addProduct",
            new ContractFunctionParameters())
        .executeWithSigner(wallet);

    if (
        contractCallResult.errorMessage != null &&
        contractCallResult.errorMessage != ""
    ) {
        throw new Error(`error calling contract: ${contractCallResult.errorMessage}`);
    }
}

export async function deleteProduct(id: string) {
    var wallet = await getProductSmartContractWallet();

    if (process.env.PRODUCT_CONTRACT_ID == null) {
        throw new Error(
            "Environment variable PRODUCT_CONTRACT_ID are required."
        );
    }

    const contractCallResult = await new ContractCallQuery()
        .setContractId(process.env.PRODUCT_CONTRACT_ID!)
        .setGas(100000)
        .setFunction("addProduct",
            new ContractFunctionParameters())
        .executeWithSigner(wallet);

    if (
        contractCallResult.errorMessage != null &&
        contractCallResult.errorMessage != ""
    ) {
        throw new Error(`error calling contract: ${contractCallResult.errorMessage}`);
    }
}
