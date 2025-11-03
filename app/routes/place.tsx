import {
  DataContainer,
  PlaceList,
  SideMenu,
} from "~/components/page/sidemenu/sidemenu";
import { useDisplayedPlaces } from "~/context/displayed-places";
import type { Route } from "./+types/place";
import { redirect, useNavigate, useNavigation } from "react-router";
import { Link } from "~/components/design-system/link";
import { ArrowLeft, ArrowUpRightSquareSolid, Notes } from "iconoir-react";
import { Button } from "~/components/design-system/button";
import { Tag } from "~/components/design-system/tag";
import { useEffect } from "react";
import { useMapboxMap } from "~/context/mapbox-gl";
import type { TagDTO } from "~/api/places/types";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Place({
  params: { id: placeId },
}: Route.ComponentProps) {
  const navigate = useNavigate();
  const navigation = useNavigation();

  const places = useDisplayedPlaces();
  const [map] = useMapboxMap();
  const place = places.find((i) => i.id === placeId);
  if (place === undefined) {
    return redirect("/");
  }

  useEffect(() => {
    const longitude = place.longitude;
    const latitude = place.latitude;
    if (map && longitude !== undefined && latitude !== undefined) {
      {
        map.flyTo({
          center: [longitude, latitude],
          zoom: Math.max(map.getZoom(), 12),
        });
      }
    }
  }, [place]);

  return (
    <SideMenu>
      <div className="grid grid-cols-[auto_1fr] gap-2 items-center w-full">
        <Button
          className="px-3"
          disabled={navigation.state === "loading"}
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeft />
        </Button>
        <Tags type={place.type} tags={place.tags} visited={place.visited} />
      </div>
      <DataContainer className="p-3">
        <Header cover={place.cover} />
        <h1 className="text-4xl mb-1">{place.name}</h1>
        {/* <ul className="flex justify-between">
          <div className="max-w-12">
            <Button href={place.url} target="_blank" className="px-3">
              <Notes />
            </Button>
            <span className="text-xs leading-0.5 text-neutral-text-medium">
              Open in Notion
            </span>
          </div>
        </ul> */}
        <ul>
          <PlaceLink link={place.url} />
          <li>
            <Link href={place.url} target="_blank">
              Notion
            </Link>{" "}
            <ArrowUpRightSquareSolid className="inline p-0.5" />
          </li>
        </ul>
      </DataContainer>
    </SideMenu>
  );
}

const Header = ({ cover }: { cover: string | undefined }) => {
  if (cover === undefined) {
    return <></>;
  }
  return <img src={cover} className="w-full h-64 object-cover rounded mb-4" />;
};

const PlaceLink = ({ link }: { link?: string }) => {
  if (link) {
    const url = URL.parse(link ?? "");
    if (url) {
      return (
        <p>
          <b>Link: </b>
          <Link href={link} target="_blank">
            {url.hostname}
          </Link>{" "}
          <ArrowUpRightSquareSolid className="inline p-0.5" />
        </p>
      );
    } else {
      return (
        <p>
          <b>Link: </b>{" "}
          <Link href={link} target="_blank">
            {link}
          </Link>
        </p>
      );
    }
  }
};

const Tags = ({
  type,
  tags,
  visited,
}: {
  type?: string;
  tags?: TagDTO[];
  visited?: boolean;
}) => {
  return (
    <ul className="flex gap-2 overflow-x-auto w-full">
      <li>
        <Tag filled>{type}</Tag>
      </li>
      {visited && (
        <li>
          <Tag>Visited</Tag>
        </li>
      )}
      {tags?.map((i) => (
        <li>
          <Tag key={i.id}>{i.name}</Tag>
        </li>
      ))}
    </ul>
  );
};
