import { Models } from "node-appwrite"

export interface AppwritePlace extends Models.Document {
    notion_id: string;
}

export interface AppwriteCollection extends Models.Document {
    notion_id: string;
}