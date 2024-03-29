import { NavArrowDown, PinAlt, Plus } from "iconoir-react";
import { PropsWithChildren, useState } from "react";
import { useMapboxMap } from "../../context/mapbox-gl";
import { useFilteredPlaces, usePageState } from "../../context/page-state";
import { usePlacesContext } from "../../context/places";
import { getAuth } from "../../endpoint";
import { Badge } from "../badge";
import {
  ContentContainer,
  HeaderContainer,
  HeaderTextBox,
  SideBarContainer,
} from "./Sidebar";
import { SidebarListItem } from "./SidebarListItem";

export const DefaultSidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const { places } = usePlacesContext();
  let filteredSource = useFilteredPlaces();
  const [map] = useMapboxMap();

  const {
    setSelectedPlace,
    attractionFilter,
    setAttractionFilter,
    collectionFilter,
    setCollectionFilter,
    setLocalPlaces,
    setSearchQuery,
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
      setLocalPlaces([lat, lng]);
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
          <button className="text-xs p-3" onClick={() => setSearchQuery("as")}>
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
          <select onChange={(e) => onChangeCollectionFilter(e.target.value)}>
            {collections.map((i) => (
              <option selected={collectionFilter === (i ?? "All")}>{i}</option>
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
            <SidebarListItem
              place={place}
              onClick={() => {
                setSelectedPlace(place.Id);
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
