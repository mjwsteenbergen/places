import { config } from "dotenv";
import { Client } from "@notionhq/client";
import type { NotionPlace } from "./types";

const getClient = () => {
  const env = config();

  if (env.error) {
    throw new Error(env.error.message);
  }

  return new Client({
    auth: env.parsed?.NOTION_TOKEN,
  });
};

export const getNotionPlaces = async (): Promise<NotionPlace[]> => {
  const query = await getClient().dataSources.query({
    data_source_id: "aae2ea05-080c-43cf-aa7c-51845900282b",
  });
  return query.results as NotionPlace[];
  // return await getClient().dataSources.retrieve({});
  // return await getClient().databases.retrieve({
  //     database_id: "4f0467a0-1f84-4819-8114-36e96a4d8b55",
  // })
};
