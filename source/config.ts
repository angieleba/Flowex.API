
// Provide required connection from environment variables
const key = process.env.COSMOS_KEY;
// Endpoint format: https://YOUR-RESOURCE-NAME.documents.azure.com:443/
const endpoint = process.env.COSMOS_ENDPOINT;

const config = {
    endpoint: "https://127.0.0.1:8081",
    key: "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==",
    databaseId: "Overpass",
    userContainerId: "Users",
    partitionKey: { kind: "Hash", paths: ["/partitionKey"] }
  };
  
 export default config;