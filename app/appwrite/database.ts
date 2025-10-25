import type { NotionPlace } from "~/api/notion/types";
import { createAdminClient, type AppWriteClient } from "./server";
import type { AppwritePlace } from "./database-definitions";
import { ID, Permission, Query, Role, type Models } from "node-appwrite";

export const getAllowedPlaces = async (client: AppWriteClient, places: NotionPlace[]) => {
    const placeRows = await getAppwritePlaces(client);
    console.log("getAllowedPlaces.placeRows", placeRows.length);
    console.log("getAllowedPlaces.places", places.length);
    const res = places.filter(place => placeRows.some(row => row.notion_id === place.id));
    console.log("getAllowedPlaces.res", res.length);
    return res;
}

const getAppwritePlaces = async (client: AppWriteClient) => {
const appwriteTable = await client.database.listDocuments(
        "68ed67c5001f8347081f",
        "68ed67cc0003cf18c95b",
        [
            Query.limit(300),
        ],
    );
    return appwriteTable.documents as unknown as AppwritePlace[];
}

export const updatePlacesCollection = async (places: NotionPlace[]) => {
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

    // const removedPlaces = appwriteTable.documents.filter(i => places.some(j => j.id === (i as unknown as AppwritePlace).notion_id));
    // const removedPlaces = appwriteTable.documents;
    console.log("length", placeRows.length)
    // if (removedPlaces.length > 0) {
    //     await Promise.allSettled(removedPlaces.map(row => {
    //         return database.deleteDocument(
    //             "68ed67c5001f8347081f",
    //             "68ed67cc0003cf18c95b",
    //             row.$id
    //         )
    //     }))
    // }


    // places.filter(place => !appwriteTable.documents.some(appwritePlace => appwritePlace.notion_id === place.id));
    const newPlaces = places.filter(place => !placeRows.some(appwritePlace => appwritePlace.notion_id === place.id));

    if (newPlaces.length > 0) {
        await Promise.allSettled(newPlaces.map(place => {
            return database.createDocument(
                "68ed67c5001f8347081f",
                "68ed67cc0003cf18c95b",
                ID.unique(),
                {
                    notion_id: place.id,
                } satisfies Omit<AppwritePlace, keyof Models.Document>,
                [Permission.write(Role.team('admin')), Permission.read(Role.team('admin'))]
            )
        }))
    }



    // await teams.createMembership("admin", [], undefined, "68ed54f7b440d6690ad2")


}