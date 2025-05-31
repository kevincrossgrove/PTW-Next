/**
 * scripts/addMockUsers.js
 *
 * Description:
 *  A standalone Node.js script to insert mock users into the 'users' collection
 *  used by Better Auth’s MongoDB adapter. Each mock user has:
 *    - name: string
 *    - email: string
 *    - emailVerified: Date (or null)
 *    - image: null
 *    - createdAt: Date
 *    - updatedAt: Date
 *    - appRole: one of 'trainer', 'parent', or 'player'
 *    - mockUser: true
 *
 * Usage:
 *  1. Install dependencies (if you haven’t already):
 *     npm install mongodb dotenv
 *
 *  2. Create a .env file at your project root with:
 *     MONGODB_URI=mongodb://localhost:27017
 *     MONGODB_DB_NAME=your_database_name
 *
 *  3. Run the script:
 *     node scripts/addMockUsers.js
 *
 * Notes:
 *  - This script does not set a password or passwordHash. If you need these accounts
 *    to be fully functional for authentication, you must either:
 *      a. Generate a proper hashing function (e.g. argon2, bcrypt) and insert
 *         a `passwordHash` field that matches your Better Auth config, OR
 *      b. Use Better Auth’s server‐side API (e.g. auth.api.createUser) to create users
 *         so the password is hashed consistently.
 *
 *  - Adjust the array of mock users as needed for your use case.
 */

import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

// Validate environment variables
const uri = process.env.MONGODB_CONNECTION_STRING;
const dbName = "database";

if (!uri) {
  console.error("Error: MONGODB_URI is not set in .env");
  process.exit(1);
}
if (!dbName) {
  console.error("Error: MONGODB_DB_NAME is not set in .env");
  process.exit(1);
}

async function addMockUsers() {
  // 1. Connect to MongoDB
  const client = new MongoClient(uri!);
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    // 2. Get the database and 'users' collection
    const db = client.db(dbName); // :contentReference[oaicite:10]{index=10}
    const usersCollection = db.collection("user"); // :contentReference[oaicite:11]{index=11}

    // 3. Prepare mock user documents
    const now = new Date();
    const mockUsers = [
      {
        name: "Alice Trainer",
        email: "alice.trainer@example.com",
        emailVerified: now,
        image: null,
        createdAt: now,
        updatedAt: now,
        appRole: "trainer", // custom field
        mockUser: true, // custom field
      },
      {
        name: "Bob Parent",
        email: "bob.parent@example.com",
        emailVerified: now,
        image: null,
        createdAt: now,
        updatedAt: now,
        appRole: "parent",
        mockUser: true,
      },
      {
        name: "Charlie Player",
        email: "charlie.player@example.com",
        emailVerified: now,
        image: null,
        createdAt: now,
        updatedAt: now,
        appRole: "player",
        mockUser: true,
      },
      // Add more mock users here if desired
    ];

    // 4. Insert mock users into the 'users' collection
    const result = await usersCollection.insertMany(mockUsers);
    console.log(
      `🎉 Inserted ${result.insertedCount} mock users into '${dbName}.users'`
    );
  } catch (error) {
    console.error("❌ Error inserting mock users:", error);
  } finally {
    // 5. Close the MongoDB connection
    await client.close();
    console.log("🔒 MongoDB connection closed");
  }
}

// Execute the script
addMockUsers().catch((err) => {
  console.error("Unhandled Exception:", err);
  process.exit(1);
});
