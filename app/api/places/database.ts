import type { Models } from "node-appwrite";
import type {
  AppwriteCollection,
  AppwritePlace,
  AppwriteCapability,
} from "../appwrite/database-definitions";
import type { AppWriteClient } from "../appwrite/server";
import type { NotionPlace, Select } from "../notion/types";
import type { PlaceDTO, TagDTO, UserDTO } from "./types";

const toPlaceDTO = (
  capabilities: AppwriteCapability[],
  notionPlace: NotionPlace,
  appwritePlace: AppwritePlace,
  tags: TagDTO[]
): PlaceDTO => {
  const sharing = capabilities.some((capability) => {
    return (capability.name = "sharing");
  });
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
    permissions: sharing ? appwritePlace.$permissions : [],
  };
};

export const getPlacesDTO = (
  capabilities: AppwriteCapability[],
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
      return toPlaceDTO(capabilities, notionPlace, appwritePlace!, tags);
    });
};

const toTagDTO = (
  capabilities: AppwriteCapability[],
  notionSelect: Select,
  appwriteCollection: AppwriteCollection
): TagDTO => {
  const sharing = capabilities.some((capability) => {
    return (capability.name = "sharing");
  });

  return {
    id: notionSelect.id,
    name: notionSelect.name,
    permissions: sharing ? appwriteCollection.$permissions : undefined,
  };
};

export const getTagsDTO = (
  capabilities: AppwriteCapability[],
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
    .filter((i): i is [Select, AppwriteCollection] => i[1] !== undefined)
    .map(([notionSelect, appwriteCollection]) =>
      toTagDTO(capabilities, notionSelect, appwriteCollection)
    );
};

export const toUserDTO = (user: Models.User): UserDTO => {
  return {
    id: user.$id,
    name: user.name,
  };
};
