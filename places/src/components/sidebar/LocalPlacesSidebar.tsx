import { Cancel } from "iconoir-react";
import { PlaceDetailsView, BasicPlaceView } from "./DetailedSidebar";
import {
  SideBarContainer,
  HeaderContainer,
  ContentContainer,
  HeaderTextBox,
} from "./Sidebar";
import { usePageState } from "../../context/page-state";
import { useEffect, useState } from "react";
import { useMapboxMap } from "../../context/mapbox-gl";
import { BasicPlace, cachedApi } from "../../endpoint";
import { SidebarListItem } from "./SidebarListItem";

export const LocalPlacesView = ({
  localPlaces,
}: {
  localPlaces: BasicPlace[];
}) => {
  const { setSelectedPlace, setLocalPlaces } = usePageState();

  return (
    <SideBarContainer>
      <HeaderContainer className="justify-end">
        <button
          className={"text-xs p-3"}
          onClick={() => setLocalPlaces(undefined)}
        >
          <Cancel />
        </button>
      </HeaderContainer>
      <ContentContainer expanded>
        <ul className="reset grid gap-1">
          {localPlaces.map((i) => (
            <SidebarListItem
              place={i}
              onClick={() => {
                setSelectedPlace(i);
              }}
            />
          ))}
        </ul>
      </ContentContainer>
    </SideBarContainer>
  );
};
