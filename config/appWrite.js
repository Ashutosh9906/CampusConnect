import dotenv from "dotenv";
import { Client, Account } from "node-appwrite";
dotenv.config();

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID);

const account = new Account(client);

export {
    client,
    account
}
