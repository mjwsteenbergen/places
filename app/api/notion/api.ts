import { config } from "dotenv";
import { Client } from "@notionhq/client";
import type { NotionPlace } from "./types";

const getClient = () => {
  const env = config({
    quiet: true,
  });

  return new Client({
    auth: process.env.NOTION_TOKEN,
  });
};

export const getNotionPlaces = async (): Promise<NotionPlace[]> => {
  const query = await getClient().dataSources.query({
    data_source_id: "aae2ea05-080c-43cf-aa7c-51845900282b",
  });
  let results = query.results;
  let has_more = query.has_more;
  let next_cursor = query.next_cursor;

  while (has_more) {
    const nextQuery = await getClient().dataSources.query({
      data_source_id: "aae2ea05-080c-43cf-aa7c-51845900282b",
      start_cursor: next_cursor || undefined,
    });
    results = results.concat(nextQuery.results);
    has_more = nextQuery.has_more;
    next_cursor = nextQuery.next_cursor;
  }

  return results as NotionPlace[];
  // return await getClient().dataSources.retrieve({});
  // return await getClient().databases.retrieve({
  //     database_id: "4f0467a0-1f84-4819-8114-36e96a4d8b55",
  // })
};
