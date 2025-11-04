import type { NotionPlace, Select } from "~/api/notion/types";
import { createAdminClient, type AppWriteClient } from "./server";
import type { AppwriteCollection, AppwritePlace } from "./database-definitions";
import { ID, Permission, Query, Role, type Models } from "node-appwrite";

export const getAllowedPlaces = async (
  client: AppWriteClient,
  places: NotionPlace[]
) => {
  const placeRows = await getAppwritePlaces(client);
  const res = places.filter((place) =>
    placeRows.some((row) => row.notion_id === place.id)
  );
  return res;
};

export const getAppwriteCollections = async (client: AppWriteClient) => {
  const appwriteTable = await client.database.listDocuments(
    "68ed67c5001f8347081f",
    "68fc8d17001f601bbe93",
    [Query.limit(300)]
  );
  return appwriteTable.documents as unknown as AppwriteCollection[];
};

export const getAppwritePlaces = async (client: AppWriteClient) => {
  const appwriteTable = await client.database.listDocuments(
    "68ed67c5001f8347081f",
    "68ed67cc0003cf18c95b",
    [Query.limit(300)]
  );
  return appwriteTable.documents as unknown as AppwritePlace[];
};

export const syncCollections = async (places: NotionPlace[]) => {
  const client = await createAdminClient();
  const { account, database, teams } = client;
  const collectionRows = await getAppwriteCollections(client);

  const notionCollections = places
    .flatMap((i) => i.properties.Tags.multi_select)
    .reduce((acc, cur) => {
      if (!acc.some((i) => i.id === cur.id)) {
        acc.push(cur);
      }
      return acc;
    }, [] as Select[]);

  //   collectionRows.

  const removedPlaces = collectionRows.filter(
    (i) => !notionCollections.some((j) => j.id === i.notion_id)
  );
  if (removedPlaces.length > 0) {
    await Promise.allSettled(
      removedPlaces.map((row) => {
        return database.deleteDocument(
          "68ed67c5001f8347081f",
          "68fc8d17001f601bbe93",
          row.$id
        );
      })
    );
  }

  const newCollections = notionCollections.filter(
    (collection) =>
      !collectionRows.some(
        (appwriteCollection) => appwriteCollection.notion_id === collection.id
      )
  );

  if (newCollections.length > 0) {
    await Promise.allSettled(
      newCollections.map((collection) => {
        return database.createDocument(
          "68ed67c5001f8347081f",
          "68fc8d17001f601bbe93",
          ID.unique(),
          {
            notion_id: collection.id,
          } satisfies Omit<AppwriteCollection, keyof Models.Document>,
          [
            Permission.write(Role.team("admin")),
            Permission.read(Role.team("admin")),
          ]
        );
      })
    );
  }
};

export const syncPlaces = async (places: NotionPlace[]) => {
  const client = await createAdminClient();
  const { account, database, teams } = client;
  const placeRows = await getAppwritePlaces(client);
  // const placeRows = (await Promise.allSettled(new Array(3).fill(1).map((_, index) => {
  //     return database.listDocuments(
  //     "68ed67c5001f8347081f",
  //     "68ed67cc0003cf18c95b",
  //     [
  //         Query.limit(100),
  //         Query.offset(100*index)
  //     ],
  // )
  // }))).reduce((res, item) => {
  //     if(item.status === "fulfilled") {
  //         return res.concat(item.value.documents as unknown as AppwritePlace[]);
  //     } else {
  //         throw new Error();
  //     }
  // }, [] as AppwritePlace[])

  // const removedPlaces = appwriteTable.documents;
  const removedPlaces = placeRows.filter(
    (i) => !places.some((j) => j.id === i.notion_id)
  );
  console.log("length", placeRows.length);
  if (removedPlaces.length > 0) {
    await Promise.allSettled(
      removedPlaces.map((row) => {
        return database.deleteDocument(
          "68ed67c5001f8347081f",
          "68ed67cc0003cf18c95b",
          row.$id
        );
      })
    );
  }

  // places.filter(place => !appwriteTable.documents.some(appwritePlace => appwritePlace.notion_id === place.id));
  const newPlaces = places.filter(
    (place) =>
      !placeRows.some((appwritePlace) => appwritePlace.notion_id === place.id)
  );

  if (newPlaces.length > 0) {
    await Promise.allSettled(
      newPlaces.map((place) => {
        return database.createDocument(
          "68ed67c5001f8347081f",
          "68ed67cc0003cf18c95b",
          ID.unique(),
          {
            notion_id: place.id,
          } satisfies Omit<AppwritePlace, keyof Models.Document>,
          [
            Permission.write(Role.team("admin")),
            Permission.read(Role.team("admin")),
          ]
        );
      })
    );
  }

  // await teams.createMembership("admin", [], undefined, "68ed54f7b440d6690ad2")
};
