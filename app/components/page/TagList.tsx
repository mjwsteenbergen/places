import { Tag } from "../design-system/tag";
import { Link } from "react-router";
import type { PlaceDTO, TagDTO } from "~/api/places/types";
import { twMerge } from "tailwind-merge";

export const TagList = ({
  places,
  className,
}: {
  places: PlaceDTO[];
  className?: string;
}) => {
  const notionCollections = places
    .flatMap((i) => i.tags)
    .reduce((acc, cur) => {
      if (!acc.some((i) => i.id === cur.id)) {
        acc.push(cur);
      }
      return acc;
    }, [] as TagDTO[]);
  return (
    <ul
      className={twMerge(
        "grid grid-flow-col gap-1 overflow-x-auto min-h-10 pl-1 items-center",
        className
      )}
    >
      {notionCollections.map((tag) => (
        <Link to={"/collection/" + tag.id} key={tag.id}>
          <Tag key={tag.id}>{tag.name}</Tag>
        </Link>
      ))}
    </ul>
  );
};
