// Provide required connection from environment variables
const key = process.env.COSMOS_KEY;
// Endpoint format: https://YOUR-RESOURCE-NAME.documents.azure.com:443/
const endpoint = process.env.COSMOS_ENDPOINT;

const databaseName = `Overpass`;
const containerName = `Users`;
const partitionKeyPath = ["/id"];

const config = {
    endpoint: endpoint,
    key: key,
    databaseId: "Overpass",
    containerId: "Users",
    partitionKey: { kind: "Hash", paths: ["/id"] }
  };
  
  module.exports = config;