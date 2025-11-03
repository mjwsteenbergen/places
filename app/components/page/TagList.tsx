import { Tag } from "../design-system/tag";
import { Link } from "react-router";
import { Button } from "../design-system/button";
import type { PlaceDTO, TagDTO } from "~/api/places/types";

export const TagList = ({ places }: { places: PlaceDTO[] }) => {
  const notionCollections = places
    .flatMap((i) => i.tags)
    .reduce((acc, cur) => {
      if (!acc.some((i) => i.id === cur.id)) {
        acc.push(cur);
      }
      return acc;
    }, [] as TagDTO[]);
  return (
    <ul className="grid grid-flow-col gap-1 overflow-x-auto min-h-10">
      {notionCollections.map((tag) => (
        <Link to={"/collection/" + tag.id} key={tag.id}>
          <Tag key={tag.id}>{tag.name}</Tag>
        </Link>
      ))}
    </ul>
  );
};
