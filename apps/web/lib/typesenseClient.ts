import { Client } from "typesense"

export const typesense = new Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST as string,
      port: 443,
      protocol: "https",
    },
  ],
  apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY as string,
})
