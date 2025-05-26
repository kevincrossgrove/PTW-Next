import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

const client = new MongoClient("mongodb://localhost:27018/database");
const db = client.db();

export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  database: mongodbAdapter(db),
  plugins: [nextCookies()], // make sure this is the last plugin in the array
});
