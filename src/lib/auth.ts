import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { z } from "zod";


  


const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing");
}

const client = new MongoClient(uri);

// Connect to MongoDB before initializing Better Auth
await client.connect();

console.log("Better Auth MongoDB connected successfully!");

const db = client.db("pizza-hub");

export type UserRole = "customer" | "vendor" | "admin";




export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  trustedOrigins: [
    process.env.CLIENT_URL || "http://localhost:3000",
  ],

  emailAndPassword: {
    enabled: true,
  },

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
        required: false,
        defaultValue: "customer",
        input: true,
        validator: {
          input: z.enum(["customer", "vendor"]),
        },
         
      },
    },
  },

  /**
   * Storage-layer guarantees for `role` (defense in depth):
   * - On create: any value that is not "customer"/"vendor" is forced to
   *   "customer" — covers sign-up, OAuth and any future user-creation path.
   * - On update: a payload containing `role` aborts the update — the role is
   *   chosen at sign-up and can never be changed afterwards.
   */
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (user.role !== "customer" && user.role !== "vendor") {
            return { data: { role: "customer" } };
          }
        },
      },
      update: {
        before: async (data) => {
          if ("role" in data) {
            return false;
          }
        },
      },
    },
  },
});