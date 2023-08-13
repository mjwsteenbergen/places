import { Cancel, Plus } from "iconoir-react";
import { PlaceDetailsView, BasicPlaceView } from "./DetailedSidebar";
import { SideBarContainer, HeaderContainer, ContentContainer } from "./Sidebar";
import { useState, useEffect, useTransition } from "react";
import { useMapboxMap } from "../../context/mapbox-gl";
import { usePageState } from "../../context/page-state";
import { BasicPlace, PlaceDetails, cachedApi, getPlaces } from "../../endpoint";
import { usePlacesContext } from "../../context/places";

export const SelectedAddPlaceSidebar = ({
  selectedPlace,
}: {
  selectedPlace: BasicPlace;
}) => {
  const { setSelectedAddPlace, setGoogleResults } = usePageState();
  const { setPlaces } = usePlacesContext();
  const [map] = useMapboxMap();

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

  const add = (place: BasicPlace) => {
    cachedApi.search(place.Id).then((i) => {
      if (Array.isArray(i)) {
        setSelectedAddPlace(undefined);
      } else {
        setTimeout(() => {
          getPlaces().then((places) => {
            const newPlace = places.Reply.Result.find(
              (i) => i.Name === place.Name
            );
            setPlaces(places.Reply.Result);
            if (newPlace) {
              console.log("found place", newPlace);
              setSelectedAddPlace(newPlace);
            } else {
              console.log("could not find place");
              setSelectedAddPlace(undefined);
            }
          });
        }, 1000);
      }
      setGoogleResults(undefined);
    });
  };

  return (
    <SideBarContainer>
      <HeaderContainer className="justify-end">
        <button className={"text-xs p-3"} onClick={() => add(selectedPlace)}>
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
