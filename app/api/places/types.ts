export type PlaceDTO = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  tags: TagDTO[];
  visited: boolean;
  cover: string;
  url: string;
  permissions?: string[];
};

export type TagDTO = {
  id: string;
  name: string;
  permissions?: string[];
};

export type UserDTO = {
  id: string;
  name: string;
};
