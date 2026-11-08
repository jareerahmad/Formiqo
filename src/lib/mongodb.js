
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "formiqo";

if (!uri) {
    throw new Error(
        "Please define MONGODB_URI in your .env.local file"
    );
}

const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }

    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export async function getDatabase() {
    const connectedClient = await clientPromise;
    return connectedClient.db(dbName);
}
