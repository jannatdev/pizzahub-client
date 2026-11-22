import "server-only";

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { z } from "zod";
import { jwt } from "better-auth/plugins";


  


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





const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  trustedOrigins: [...new Set(allowedOrigins)],
    plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          sub: user.id,
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }),
      },
    }),
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
      input: false,
    },
    businessName: {
      type: "string",
      required: false,
      input: false,
    },
  },
},

  
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