import mapboxgl, { type Map as MapBoxMap } from "mapbox-gl";
import { useMapboxMap } from "../../../context/mapbox-gl";
import { createPlaces, fitAllInBounds } from "./createPlaces";
import { useRef, useEffect } from "react";
// import "./map.scss";
import type { NotionPlace } from "~/api/notion/types";
import { useDisplayedPlaces, usePlaces } from "~/context/displayed-places";
import { onLoad } from "./yolo2";
import { useNavigate } from "react-router";

let setter: (sel?: NotionPlace) => void = () => {};

export const getStateSetter = () => {
  const x = setter;
  return x;
};

export const Map = () => {
  const allPlaces = usePlaces();
  const filteredPlaces = useDisplayedPlaces();
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapBoxMap | null>(null);
  const [map, setMap] = useMapboxMap();
  //   const { setSelectedPlace } = usePageState();
  //   setter = (sel?: NotionPlace) => {
  //     setSelectedPlace(sel?.id);
  //   };
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibmV3bm90dGFrZW5uYW1lIiwiYSI6ImNsOHhpOTQ0YzAycjAzcHAydGR2bmN5MTYifQ.aNK_O6pCnTXSkxNJ2DcdPQ";

    const element = mapContainerRef.current as HTMLDivElement;
    const map = new mapboxgl.Map({
      container: element,
      style: "mapbox://styles/newnottakenname/cl8xigw5t002s14pbpejhf6ug",
      zoom: 4,
      center: [5.55, 52.316667],
    });

    map.on("load", () => {
      if (filteredPlaces.length > 0) {
        fitAllInBounds(map, filteredPlaces);
        createPlaces(map, filteredPlaces, navigate);
      }
    });

    map.addControl(
      new mapboxgl.GeolocateControl({
        showUserHeading: true,
        showAccuracyCircle: true,
        showUserLocation: true,
        trackUserLocation: true,
      })
    );

    setMap(map);
  }, []);

  // useEffect(() => {
  //   if (map?.getLayer && filteredPlaces.length > 0) {
  //     if (map.loaded()) {
  //       createPlaces(map, filteredPlaces);
  //       if (filteredPlaces.length < allPlaces.length) {
  //         fitAllInBounds(map, filteredPlaces);
  //       }
  //     } else {
  //       map.on("load", () => {
  //         createPlaces(map, filteredPlaces);
  //       });
  //     }
  //   }
  // }, [filteredPlaces]);
  return (
    <div
      ref={mapContainerRef}
      className="!fixed bottom-0 left-0 top-0 right-0 overflow-hidden overscroll-none"
    ></div>
  );
};
