import { Db, MongoClient } from "mongodb";
import "./env";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);

  await client.connect();

  const db = client.db(process.env.MONGODB_DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
}
