import {
  DataContainer,
  PlaceList,
  SideMenu,
} from "~/components/page/sidemenu/sidemenu";
import { useDisplayedPlaces } from "~/context/displayed-places";
import type { Route } from "./+types/place";
import { redirect, useNavigate, useNavigation } from "react-router";
import type {
  CheckboxProp,
  Cover,
  MultiSelectProp,
  SelectProp,
  UrlProp,
} from "~/api/notion/types";
import { Link } from "~/components/design-system/link";
import { ArrowLeft, ArrowUpRightSquareSolid, Notes } from "iconoir-react";
import { Button } from "~/components/design-system/button";
import { Tag } from "~/components/design-system/tag";
import { useEffect } from "react";
import { useMapboxMap } from "~/context/mapbox-gl";

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
    const longitude = place.properties.Longitude.number;
    const latitude = place.properties.Latitude.number;
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
      <div className="flex justify-between items-center">
        <Button
          className="px-3"
          disabled={navigation.state === "loading"}
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeft />
        </Button>
        <Tags
          type={place.properties.Type}
          tags={place.properties.Tags}
          visited={place.properties.Visited}
        />
      </div>
      <DataContainer className="p-3">
        <Header cover={place.cover} />
        <h1 className="text-4xl mb-1">
          {place.properties.Name.title.map((i) => i.plain_text).join()}
        </h1>
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
          <PlaceLink link={place.properties.Link} />
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

const Header = ({ cover }: { cover: Cover | undefined }) => {
  if (cover?.external?.url === undefined) {
    return <></>;
  }
  return (
    <img
      src={cover.external.url}
      className="w-full h-64 object-cover rounded mb-4"
    />
  );
};

const PlaceLink = ({ link }: { link?: UrlProp }) => {
  const linkUrl = link?.url;
  if (linkUrl) {
    const url = URL.parse(linkUrl ?? "");
    if (url) {
      return (
        <p>
          <b>Link: </b>
          <Link href={linkUrl} target="_blank">
            {url.hostname}
          </Link>{" "}
          <ArrowUpRightSquareSolid className="inline p-0.5" />
        </p>
      );
    } else {
      return (
        <p>
          <b>Link: </b>{" "}
          <Link href={linkUrl} target="_blank">
            {linkUrl}
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
  type?: SelectProp;
  tags?: MultiSelectProp;
  visited?: CheckboxProp;
}) => {
  return (
    <ul className="flex gap-2">
      <li>
        <Tag filled>{type?.select.name}</Tag>
      </li>
      {visited?.checkbox && (
        <li>
          <Tag>Visited</Tag>
        </li>
      )}
      {tags?.multi_select.map((i) => (
        <li>
          <Tag key={i.id}>{i.name}</Tag>
        </li>
      ))}
    </ul>
  );
};
