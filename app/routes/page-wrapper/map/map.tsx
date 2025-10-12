import mapboxgl from "mapbox-gl";
import { useMapboxMap } from "../../../context/mapbox-gl";
import { createPlaces, fitAllInBounds } from "./createPlaces";
import { useRef, useEffect } from "react";
// import "./map.scss";
import type { NotionPlace } from "~/api/notion/types";

(mapboxgl as any).accessToken =
  "pk.eyJ1IjoibmV3bm90dGFrZW5uYW1lIiwiYSI6ImNsOHhpOTQ0YzAycjAzcHAydGR2bmN5MTYifQ.aNK_O6pCnTXSkxNJ2DcdPQ";

let setter: (sel?: NotionPlace) => void = () => {};

export const getStateSetter = () => {
  const x = setter;
  return x;
};

export const Map = ({ places: allPlaces, filteredPlaces }: { places: NotionPlace[], filteredPlaces: NotionPlace[] }) => {
  const ref = useRef(null);
  const [map, setMap] = useMapboxMap();
//   const { setSelectedPlace } = usePageState();
//   setter = (sel?: NotionPlace) => {
//     setSelectedPlace(sel?.id);
//   };
  useEffect(() => {
    if (ref.current === null || filteredPlaces === undefined || map) {
      return;
    }
    const element = ref.current as HTMLDivElement | null;
    if (element) {
      const map = new mapboxgl.Map({
        container: element,
        style: "mapbox://styles/newnottakenname/cl8xigw5t002s14pbpejhf6ug",
        zoom: 4,
        center: [5.55, 52.316667],
      });

      setMap(map);

      const create = () => {
        fitAllInBounds(map, filteredPlaces);
        createPlaces(map, filteredPlaces);
      };

      console.log(filteredPlaces.length);
      if (filteredPlaces.length > 0) {
        if (map.loaded()) {
          create();
        } else {
          map.on("load", create);
        }
      }

      const location = new mapboxgl.GeolocateControl({
        showUserHeading: true,
        showAccuracyCircle: true,
        showUserLocation: true,
        trackUserLocation: true,
      });

      map.addControl(location);

      return () => {
        map?.remove();
      };
    }
  }, [ref]);

  useEffect(() => {
    if (map?.getLayer && filteredPlaces.length > 0) {
      if (map.loaded()) {
        createPlaces(map, filteredPlaces);
        if (filteredPlaces.length < allPlaces.length) {
          fitAllInBounds(map, filteredPlaces);
        }
      } else {
        map.on("load", () => {
          createPlaces(map, filteredPlaces);
        });
      }
    }
  }, [filteredPlaces]);
  return <div ref={ref} className="w-screen h-[100dvh]"></div>;
};