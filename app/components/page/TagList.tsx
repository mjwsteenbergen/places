import type { NotionPlace, Select } from "~/api/notion/types";
import { Tag } from "../design-system/tag";
import { Link } from "react-router";
import { Button } from "../design-system/button";

export const TagList = ({ places }: { places: NotionPlace[] }) => {
  const notionCollections = places
    .flatMap((i) => i.properties.Tags.multi_select)
    .reduce((acc, cur) => {
      if (!acc.some((i) => i.id === cur.id)) {
        acc.push(cur);
      }
      return acc;
    }, [] as Select[]);
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
