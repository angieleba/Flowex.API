import * as dotenv from 'dotenv';

dotenv.config();

const config = {
    endpoint : process.env.COSMOS_ENDPOINT ?? "",
    key: process.env.COSMOS_KEY ?? "",
    databaseId: "Overpass",
    userContainerId: "Users",
    ordersContainerId: "Orders",
    partitionKey: { kind: "Hash", paths: ["/partitionKey"] }
  };
  
 export default config;