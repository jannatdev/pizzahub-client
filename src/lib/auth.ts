import "server-only";

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

import { jwt } from "better-auth/plugins";
import { APIError, createAuthMiddleware } from "better-auth/api";


  


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
    // Spec: minimum 6 characters, one uppercase and one lowercase letter.
    minPasswordLength: 6,
  },

  // Server-side password rules for public registration (sign-up only).
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;

      const password = ctx.body?.password as string | undefined;
      if (typeof password !== "string") return;

      if (password.length < 6) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must be at least 6 characters long.",
        });
      }
      if (!/[A-Z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must contain at least one uppercase letter.",
        });
      }
      if (!/[a-z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must contain at least one lowercase letter.",
        });
      }
    }),
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
      // Sign-up must accept the chosen role (vendor / customer). The
      // databaseHooks below force any other value (e.g. "admin") back to
      // "customer", so admin accounts still cannot be created publicly, and
      // role updates are blocked entirely.
      input: true,
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