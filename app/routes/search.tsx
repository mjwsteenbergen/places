import { Button } from "~/components/design-system/button";
import type { Route } from "./+types/search";
import {
  BackButton,
  BottomContainer,
  CollectionItem,
  DataContainer,
  PlaceList,
  PlaceMenuItem,
  SideMenu,
} from "~/components/page/sidemenu/sidemenu";
import { TagList } from "~/components/page/TagList";
import { useDisplayedPlaces } from "~/context/displayed-places";
import { Search } from "iconoir-react";
import { useMemo, type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { useSearchParams } from "react-router";
import type { TagDTO } from "~/api/places/types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Place" },
    { name: "description", content: "Your place to look at places" },
  ];
}

export const useSearchQuery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  return [
    searchParams.get("q") ?? "",
    (q: string) => {
      if (q) {
        searchParams.set("q", q);
      } else {
        searchParams.delete("q");
      }
      setSearchParams(searchParams, {
        replace: true,
      });
    },
  ] as const;
};

export default function SearchPage() {
  const places = useDisplayedPlaces();

  const notionCollections = useMemo(() => {
    return places
      .flatMap((i) => i.tags)
      .reduce((acc, cur) => {
        if (!acc.some((i) => i.id === cur.id)) {
          acc.push(cur);
        }
        return acc;
      }, [] as TagDTO[]);
  }, [places]);

  const [searchQuery, setSearchQuery] = useSearchQuery();

  const searchPlaces = places.filter((place) => {
    const query = searchQuery.toLowerCase();
    return place.name.toLowerCase().includes(query);
  });

  const searchCollections = notionCollections.filter((tag) => {
    const query = searchQuery.toLowerCase();
    return tag.name.toLowerCase().includes(query);
  });

  return (
    <SideMenu>
      <BottomContainer>
        <TextInput
          type="text"
          className="grow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </BottomContainer>
      <div className="h-full overflow-hidden flex flex-col gap-1">
        {searchPlaces.length > 0 && (
          <DataContainer className="grow-[2] basis-1">
            <h3 className="px-6 py-1 text-3xl font-heading rounded-lg">
              Places
            </h3>
            <ul>
              {searchPlaces.map((i) => {
                return <PlaceMenuItem key={i.id} place={i} />;
              })}
            </ul>
          </DataContainer>
        )}
        {searchCollections.length > 0 && (
          <DataContainer className="grow-[1] basis-1">
            <h3 className="px-6 py-1 text-3xl font-heading rounded-lg">
              Collections
            </h3>
            <ul>
              {searchCollections.map((i) => {
                return <CollectionItem key={i.id} tag={i} />;
              })}
            </ul>
          </DataContainer>
        )}
      </div>
    </SideMenu>
  );
}

export const TextInput = ({ className, ...props }: ComponentProps<"input">) => {
  return (
    <input
      type="text"
      {...props}
      className={twMerge(
        "bg-neutral-default px-4 py-2 outline-primary-outline-medium -outline-offset-4 outline-4 rounded-md border-2 border-neutral-border-high text-xl",
        className
      )}
    />
  );
};
