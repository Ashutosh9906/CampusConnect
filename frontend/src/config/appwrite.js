import { Client, Account } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://sgp.cloud.appwrite.io/v1")
  .setProject("698b0e030028607c1c65"); // put real project ID here

export const account = new Account(client);
