import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

// MongoDBAdapter Docs - https://www.better-auth.com/docs/adapters/mongo
// Admin Plugin Docs - https://www.better-auth.com/docs/plugins/admin

const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING as string);
const db = client.db();

export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
      appRole: {
        type: "string",
      },
    },
  },
  database: mongodbAdapter(db),
  plugins: [admin(), nextCookies()], // make sure nextCookies() is the last plugin in the array
});
