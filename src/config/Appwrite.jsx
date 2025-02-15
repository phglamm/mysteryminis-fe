import { Client, Storage } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite Endpoint
  .setProject("67b0163f001c5610d6cb"); // Your project ID

export const storage = new Storage(client);
