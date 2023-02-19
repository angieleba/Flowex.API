import { Client, ContractCallQuery, ContractExecuteTransaction, ContractFunctionParameters, PrivateKey } from "@hashgraph/sdk";
import { BigNumber } from 'bignumber.js';
import { getProductSmartContractWallet } from "../hedera/wallet";
import * as dotenv from 'dotenv';
import { Product } from "../models/product";
import { v4 as uuidv4 } from 'uuid';
import { convertGuidToInt } from "../services/common";
import Web3 from "web3";
import { hethers } from "@hashgraph/hethers";
import { ethers } from 'ethers';

import contractJson from '../smart-contracts/product-smart-contract.json';

dotenv.config();
const abi = contractJson.abi;
const web3 = new Web3();

const client = Client.forTestnet();
client.setOperator(process.env.PRODUCT_OPERATOR_ID as string, process.env.PRODUCT_OPERATOR_KEY as string);

function decodeFunctionResult(functionName: any, resultAsBytes: any) {
    const functionAbi = abi.find(func => func.name === functionName);
    const functionParameters = functionAbi?.outputs;
    
    const resultHex = '0x'.concat(Buffer.from(resultAsBytes).toString('hex'));
    const result = web3.eth.abi.decodeParameters(functionParameters!, resultHex);
    return result;
}

export async function getProductById(id: string, supplierId : string) {
    const contractCallResult = await new ContractCallQuery()
        .setContractId(process.env.PRODUCT_CONTRACT_ID!)
        .setGas(100000)
        .setFunction("getAllProducts",
            new ContractFunctionParameters().addString(supplierId))
        .execute(client);

    const decoded = decodeFunctionResult("getAllProducts", contractCallResult.bytes);

    if (
        contractCallResult.errorMessage != null &&
        contractCallResult.errorMessage != ""
    ) {
        throw new Error(`error calling contract: ${contractCallResult.errorMessage}`);
    }

    return decoded;
}

export async function getProducts() {
    const contractCallResult = await new ContractCallQuery()
        .setContractId(process.env.PRODUCT_CONTRACT_ID!)
        .setGas(100000)
        .setFunction("getAllProducts",
            new ContractFunctionParameters().addString("JAF Wood"))
        .execute(client);

    const decoded = decodeFunctionResult("getAllProducts", contractCallResult.bytes);

    if (
        contractCallResult.errorMessage != null &&
        contractCallResult.errorMessage != ""
    ) {
        throw new Error(`error calling contract: ${contractCallResult.errorMessage}`);
    }

    return decoded[0].map((i: string | any[]) => i.slice(0, 11))
    
    // console.log("contract message: ", contractCallResult.getBytes32());
}

export async function getProductsBySupplier(supplier: string) {
    const contractCallResult = await new ContractCallQuery()
        .setContractId(process.env.PRODUCT_CONTRACT_ID!)
        .setGas(100000)
        .setFunction("getAllProducts",
            new ContractFunctionParameters().addString(supplier))
        .execute(client);

    const decoded = decodeFunctionResult("getAllProducts", contractCallResult.bytes);

    if (
        contractCallResult.errorMessage != null &&
        contractCallResult.errorMessage != ""
    ) {
        throw new Error(`error calling contract: ${contractCallResult.errorMessage}`);
    }

    return decoded[0].map((i: string | any[]) => i.slice(0, 11))
    
    // console.log("contract message: ", contractCallResult.getBytes32());
}

export async function createProduct(product: Product, supplierId: string) : Promise<boolean> {
    try {
        if (process.env.PRODUCT_CONTRACT_ID == null || process.env.PRODUCT_OPERATOR_ID == null || process.env.PRODUCT_OPERATOR_KEY == null) {
            throw new Error(
                "Environment variables PRODUCT_CONTRACT_ID, PRODUCT_OPERATOR_ID or PRODUCT_OPERATOR_KEY are required."
            );
        }

        const client = Client.forTestnet();
        client.setOperator(process.env.PRODUCT_OPERATOR_ID, process.env.PRODUCT_OPERATOR_KEY);
        const newProductId = convertGuidToInt(product.productID);
        console.log("newProductId: " + newProductId);
        
        const productCreate = await new ContractExecuteTransaction()
            .setContractId(process.env.PRODUCT_CONTRACT_ID!)
            .setGas(10000000)
            .setFunction("addProduct",
                new ContractFunctionParameters()
                    .addString(supplierId)
                    .addUint256(newProductId)
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

export async function approveProduct(productIndex: number, productId: number, supplierId: string, baseURI: string) : Promise<boolean> {
    try {
        if (process.env.PRODUCT_CONTRACT_ID == null || process.env.PRODUCT_OPERATOR_ID == null || process.env.PRODUCT_OPERATOR_KEY == null) {
            throw new Error(
                "Environment variables PRODUCT_CONTRACT_ID, PRODUCT_OPERATOR_ID or PRODUCT_OPERATOR_KEY are required."
            );
        }
        console.log(productIndex, productId, supplierId, baseURI);
        
        const client = Client.forTestnet();
        client.setOperator(process.env.PRODUCT_OPERATOR_ID, process.env.PRODUCT_OPERATOR_KEY);

        console.log("0x"+process.env.PRODUCT_OPERATOR_KEY);
        
        const wallet = new ethers.Wallet("0x"+process.env.PRODUCT_OPERATOR_KEY);
        console.log(await wallet.getAddress());
   
        let dataToSign = {"CertificateTo":supplierId};

        let dataHash = ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(JSON.stringify(dataToSign))
        );

        let dataHashBin = ethers.utils.arrayify(dataHash)
    
     
        let signature = await wallet.signMessage(dataHashBin); 
        const r = ethers.utils.arrayify(signature.slice(0, 66));
        const s = ethers.utils.arrayify("0x" + signature.slice(66, 130));
        const v = parseInt(signature.slice(130, 132), 16);
        console.log(process.env.PRODUCT_CONTRACT_ID);
        console.log("Submitting...");
        
        const productApprove = await new ContractExecuteTransaction()
            .setContractId(process.env.PRODUCT_CONTRACT_ID)
            .setGas(10000000)
            .setFunction("approveProduct",
                new ContractFunctionParameters()
                    .addBytes32(dataHashBin)
                    .addUint8(v)
                    .addBytes32(r)
                    .addBytes32(s)
                    .addUint256(productIndex)
                    .addUint256(productId)
                    .addString(supplierId)
                    .addString(baseURI))
            .execute(client);

        //Request the receipt of the transaction
        const receipt = await productApprove.getReceipt(client);

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

        const client = Client.forTestnet();
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

        console.log("The transaction create company consensus status is " +transactionStatus);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }

}

export async function updateProductSupply(product: Product) {
    const wallet = await getProductSmartContractWallet();

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
    const wallet = await getProductSmartContractWallet();

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
