//  <createDatabaseAndContainer>
import config from "../config.js";
import { CosmosClient } from "@azure/cosmos";

/*
// This script ensures that the database is setup and populated correctly
*/
export async function createDatabase() {

  const { endpoint, key, databaseId, userContainerId } = config;
  const client = new CosmosClient({ endpoint, key });
  const partitionKey = config.partitionKey;

  /**
   * Create the database if it does not exist
   */
  const { database } = await client.databases.createIfNotExists({
    id: databaseId
  });
  console.log(`Created database:\n${database.id}\n`);

  /**
   * Create the container if it does not exist
   */
  const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists(
      { id: userContainerId, partitionKey },
      { offerThroughput: 400 }
    );

  console.log(`Created container:\n${container.id}\n`);
}

export async function getUserContainer(){
  const { endpoint, key, databaseId, userContainerId } = config;
  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container(userContainerId);

  return container;
}

  //  </createDatabaseAndContainer>