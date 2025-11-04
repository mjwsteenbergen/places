import { getAppwritePlaces } from "../appwrite/database";
import type {
  AppwriteCollection,
  AppwritePlace,
} from "../appwrite/database-definitions";
import type { NotionPlace, Select } from "../notion/types";
import type { PlaceDTO, TagDTO } from "./types";

const toPlaceDTO = (
  notionPlace: NotionPlace,
  appwritePlace: AppwritePlace,
  tags: TagDTO[]
): PlaceDTO => {
  return {
    id: notionPlace.id,
    name: notionPlace.properties.Name.title[0]?.plain_text || "",
    latitude: notionPlace.properties.Latitude.number,
    longitude: notionPlace.properties.Longitude.number,
    type: notionPlace.properties.Type.select.name,
    tags: notionPlace.properties.Tags.multi_select
      .map((i) => tags.find((tag) => tag.id === i.id)!)
      .filter(Boolean),
    visited: notionPlace.properties.Visited.checkbox,
    cover: notionPlace.cover?.external.url,
    url: notionPlace.url,
    permissions: appwritePlace.$permissions,
  };
};

export const getPlacesDTO = (
  notionPlaces: NotionPlace[],
  appwritePlaces: AppwritePlace[],
  tags: TagDTO[]
) => {
  return notionPlaces
    .map(
      (place) =>
        [
          place,
          appwritePlaces.find((row) => row.notion_id === place.id),
        ] as const
    )
    .filter((i) => i[1])
    .map(([notionPlace, appwritePlace]) => {
      return toPlaceDTO(notionPlace, appwritePlace!, tags);
    });
};

const toTagDTO = (
  notionSelect: Select,
  appwriteCollection: AppwriteCollection
): TagDTO => {
  return {
    id: notionSelect.id,
    name: notionSelect.name,
    permissions: appwriteCollection.$permissions,
  };
};

export const getTagsDTO = (
  notionSelects: Select[],
  appwriteTags: AppwriteCollection[]
) => {
  return notionSelects
    .map(
      (select) =>
        [
          select,
          appwriteTags.find((row) => row.notion_id === select.id),
        ] as const
    )
    .filter((i) => i[1])
    .map(([notionSelect, appwriteCollection]) =>
      toTagDTO(notionSelect, appwriteCollection!)
    );
};
