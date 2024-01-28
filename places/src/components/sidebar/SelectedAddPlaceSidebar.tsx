import { Cancel, Plus } from "iconoir-react";
import { PlaceDetailsView, BasicPlaceView } from "./DetailedSidebar";
import { SideBarContainer, HeaderContainer, ContentContainer } from "./Sidebar";
import { useState, useEffect, useTransition } from "react";
import { useMapboxMap } from "../../context/mapbox-gl";
import { usePageState } from "../../context/page-state";
import {
  BasicPlace,
  PlaceDetails,
  getPlaces,
  useAddPlace,
} from "../../endpoint";
import { usePlacesContext } from "../../context/places";

export const SelectedAddPlaceSidebar = ({
  selectedPlace,
}: {
  selectedPlace: BasicPlace;
}) => {
  const { setSelectedAddPlace, setSearchQuery } = usePageState();
  const [map] = useMapboxMap();
  const { mutate } = useAddPlace(selectedPlace.Id);

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

  const add = () => {
    mutate();
    setSearchQuery(undefined);
    setSelectedAddPlace(undefined);
  };

  return (
    <SideBarContainer>
      <HeaderContainer className="justify-end">
        <button className={"text-xs p-3"} onClick={() => add()}>
          <Plus />
        </button>
        <button
          className={"text-xs p-3"}
          onClick={() => setSelectedAddPlace(undefined)}
        >
          <Cancel />
        </button>
      </HeaderContainer>
      <ContentContainer expanded>
        <BasicPlaceView place={selectedPlace} />
      </ContentContainer>
    </SideBarContainer>
  );
};
