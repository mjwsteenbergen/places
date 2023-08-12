import { PinAlt, Plus, NavArrowDown } from "iconoir-react";
import { PropsWithChildren, useState } from "react";
import { useFilteredPlaces, usePageState } from "../../context/page-state";
import { cachedApi, getAuth } from "../../endpoint";
import { SidebarItem2 } from "../sidebar";
import {
  HeaderContainer,
  HeaderTextBox,
  ContentContainer,
  SideBarContainer,
} from "./Sidebar";
import { Badge } from "../badge";
import { usePlacesContext } from "../../context/places";
import { useMapboxMap } from "../../context/mapbox-gl";

export const DefaultSidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const { places } = usePlacesContext();
  let filteredSource = useFilteredPlaces();
  const [map] = useMapboxMap();

  const {
    setSelectedPlace,
    attractionFilter,
    setAttractionFilter,
    setCollectionFilter,
    setLocalPlaces,
    setGoogleResults,
    setView,
  } = usePageState();
  const [filterText, setFilterText] = useState("");
  const onChangeCollectionFilter = (name: string) => {
    if (name === "All") {
      setCollectionFilter(undefined);
    } else {
      setCollectionFilter(name);
    }
  };

  const getLocalPlaces = () => {
    if (map) {
      const { lat, lng } = map.getCenter();
      cachedApi.getLocalPlaces(lat, lng).then(async (i) => {
        setLocalPlaces(i.Reply.Result ?? []);
      });
    }
  };

  const onCheckAttractionFilter = (name: string) => {
    if (attractionFilter.includes(name)) {
      setAttractionFilter(attractionFilter.filter((i) => i !== name));
    } else {
      setAttractionFilter(attractionFilter.concat([name]));
    }
  };

  const attractions = places.reduce((res, cur) => {
    if (
      !res.includes(cur.Type) &&
      cur.Type !== null &&
      cur.Type.trim() !== ""
    ) {
      res.push(cur.Type);
    }
    return res;
  }, [] as string[]);

  filteredSource = filteredSource.filter((place) =>
    place.Name.toLowerCase().includes(filterText.toLowerCase())
  );

  const collections = ["All"].concat(
    places.reduce((res, cur) => {
      cur.tags.forEach((tag) => {
        if (!res.includes(tag)) {
          res.push(tag);
        }
      });
      return res;
    }, [] as string[])
  );

  return (
    <SideBarContainer>
      <HeaderContainer>
        <HeaderTextBox onChange={(e) => setFilterText(e)} />
        {getAuth().token && (
          <button className="text-xs p-3" onClick={() => getLocalPlaces()}>
            <PinAlt />
          </button>
        )}
        {getAuth().token && (
          <button className="text-xs p-3" onClick={() => setGoogleResults([])}>
            <Plus />
          </button>
        )}
        <button
          className={"text-xs p-3"}
          onClick={() => setExpanded(!expanded)}
        >
          <NavArrowDown
            className={"transition-all" + (expanded ? " rotate-180" : "")}
          />
        </button>
      </HeaderContainer>
      <OptionBar>
        {collections.length > 1 && (
          <select
            defaultValue="All"
            onChange={(e) => onChangeCollectionFilter(e.target.value)}
          >
            {collections.map((i) => (
              <option>{i}</option>
            ))}
          </select>
        )}
        <div className="flex gap-2 overflow-hidden overflow-x-auto pl-2 [&::-webkit-scrollbar]:hidden">
          {attractions.map((attraction) => (
            <Badge
              name={attraction}
              checked={attractionFilter.includes(attraction)}
              onClicked={() => {
                onCheckAttractionFilter(attraction);
              }}
            />
          ))}
        </div>
      </OptionBar>
      <ContentContainer expanded={expanded}>
        <ul className="reset grid gap-1">
          {filteredSource.map((place) => (
            <SidebarItem2
              place={place}
              onClick={() => {
                setSelectedPlace(place);
              }}
            />
          ))}
        </ul>
      </ContentContainer>
    </SideBarContainer>
  );
};

export const OptionBar = ({ children }: PropsWithChildren<{}>) => {
  return <div className="w-full pointer-events-auto flex">{children}</div>;
};

export const Select = ({ children }: PropsWithChildren<{}>) => {
  return <select>{children}</select>;
};
