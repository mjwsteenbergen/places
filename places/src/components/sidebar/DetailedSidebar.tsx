import { Cancel } from "iconoir-react";
import { useEffect, useState } from "react";
import { useMapboxMap } from "../../context/mapbox-gl";
import { usePageState } from "../../context/page-state";
import {
  BasicPlace,
  Place,
  PlaceDetails,
  WikipediaData,
  cachedApi,
  getAuth,
} from "../../endpoint";
import { Badge } from "../badge";
import { ContentContainer, HeaderContainer, SideBarContainer } from "./Sidebar";

type PSProps = {
  selectedPlace: BasicPlace;
};
export const PlaceDetailSidebar = ({ selectedPlace }: PSProps) => {
  const { setSelectedPlace } = usePageState();
  const [fullPlace, setFullPlace] = useState<PlaceDetails | undefined>(undefined);
  const [map] = useMapboxMap();

  useEffect(() => {
    cachedApi.getPlace(selectedPlace.Id).then((reply) => setFullPlace(reply.Reply.Result))
  }, [selectedPlace]);

  useEffect(() => {
    if (map) {
      const originaleCenter = {
        center: map.getCenter(),
        zoom: map.getZoom(),
        duration: 2000,
      };

      map.easeTo({
        center: [selectedPlace.Longitude, selectedPlace.Latitude],
        zoom: Math.max(map.getZoom(), 12),
        duration: 2000,
        // padding: padding()
      });

      return () => {
        map.easeTo(originaleCenter);
      };
    }
  }, []);


  return (
    <SideBarContainer>
      <HeaderContainer className="justify-end">
        <button
          className={"text-xs p-3"}
          onClick={() => setSelectedPlace(undefined)}
        >
          <Cancel />
        </button>
      </HeaderContainer>
      <ContentContainer expanded>
        {fullPlace ? <PlaceDetailsView place={fullPlace}/>  : <BasicPlaceView place={selectedPlace}/>}
      </ContentContainer>
    </SideBarContainer>
  );
};

type Props = {
  place: PlaceDetails;
};

export const BasicPlaceView = ({place}: { place: BasicPlace}) => {
  return <div>
    <h1>{place.Name}</h1>
    <p>{place.summary}</p>
  </div>
}

export const PlaceDetailsView = ({ place }: Props) => {
  const { PageText, PlaceProps, Wikipedia } = place;

  return (
    <>
      <div className="overflow-y-auto overflow-x-hidden">
        <div className="flex flex-shrink self-stretch justify-between max-w-full">
          <ul className="reset flex-shrink flex align-middle flex-wrap gap-2">
            {PlaceProps.type?.name && <Badge name={PlaceProps.type.name} />}
            {PlaceProps.visited && <Badge name={"Have been"} />}
            {PlaceProps.tags?.map((tag) => (
              <Badge key={tag.id} name={tag.name} />
            ))}
            {PlaceProps.link ? (
              <Badge href={PlaceProps.link} name={"View link ↗"} />
            ) : (
              ""
            )}
            <Badge
              href={
                "https://www.google.com/maps/search/" +
                PlaceProps.latitude +
                "," +
                PlaceProps.longitude
              }
              name={"Directions ↗"}
            />
          </ul>
        </div>
        <h1>{PlaceProps.name}</h1>
        {getContent(PageText)}
        {getWiki(Wikipedia)}
      </div>
      <div className="flex-grow"></div>
      {PlaceProps.id && getAuth().token && (
        <a
          className="reset asButton self-stretch text-center"
          target="_blank"
          href={"https://notion.so/" + PlaceProps.id}
        >
          Open in Notion
        </a>
      )}
    </>
  );
};

function getContent(content: string) {
  if (content && content !== "undefined") {
    return (
      <div>
        <h2>Notion</h2>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    );
  }
}

function getWiki(data: WikipediaData) {
  if (data) {
    return (
      <div>
        <h2>Wikipedia</h2>
        <details>
          <summary>
            <div
              className="text-ellipsis"
              style={{
                overflowWrap: "anywhere",
              }}
              dangerouslySetInnerHTML={{ __html: data.text }}
            ></div>
          </summary>
        </details>
        <a target="_blank" href={data.url}>
          Read on Wikipedia
        </a>
      </div>
    );
  }
  return undefined;
}
