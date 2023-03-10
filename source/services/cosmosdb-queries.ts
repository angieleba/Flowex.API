import { getOrdersContainer, getUserContainer } from "../database";
import { Order } from "../models/order";

export async function getUserById(id: string) {
    const container = await getUserContainer();

    const querySpec = {
        query: "select * from u where u.id=@id",
        parameters: [
            {
                name: "@id",
                value: id
            }
        ]
    };

    const { resources } = await container.items.query(querySpec).fetchAll();

    if(resources.length == 0) {
        return null;
    }
    
    return resources[0];
}

export async function getOrderById(id: string) : Promise<Order | null>  {
    const container = await getOrdersContainer();

    const querySpec = {
        query: "select * from u where u.id=@id",
        parameters: [
            {
                name: "@id",
                value: id
            }
        ]
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    if(resources.length == 0) {
        return null;
    }
    return resources[0];
}

export async function getUserOrders(id : string, isSupplier : boolean) : Promise<Order[]> {
    const container = await getOrdersContainer();

    const query = isSupplier ? "select * from u where u.supplierId=@id" : "select * from u where u.buyerId=@id";
    const querySpec = {
        query: query,
        parameters: [
            {
                name: "@id",
                value: id
            }
        ]
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
}


export async function createOrder(topicId: string, buyerId: string, sellerId: string) {
    try {
        const container = await getOrdersContainer();
        let order = new Order(topicId, buyerId, sellerId);
        await container.items.create(order);
    } catch(e) {
        throw new Error("Failed to create order in cosmosDB");
    }
}