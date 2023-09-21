import mapboxgl, { GeolocateControl } from "mapbox-gl";
import { BasicPlace, getAuth } from "../endpoint";
import { useMapboxMap } from "../context/mapbox-gl";
import { createPlaces, fitAllInBounds } from "./createPlaces";
import { useRef, useEffect, FunctionComponent } from "react";
import { useFilteredPlaces, usePageState } from "../context/page-state";
import './map.scss';
import { usePlacesContext } from "../context/places";

(mapboxgl as any).accessToken = 'pk.eyJ1IjoibmV3bm90dGFrZW5uYW1lIiwiYSI6ImNsOHhpOTQ0YzAycjAzcHAydGR2bmN5MTYifQ.aNK_O6pCnTXSkxNJ2DcdPQ';

let setter: (sel?: BasicPlace) => void = () => {};

export const getStateSetter = () => {
    const x=  setter;
    return x;
};

export const Map: FunctionComponent = () => {
    const ref = useRef(null);
    const [map, setMap] = useMapboxMap();
    const filteredPlaces = useFilteredPlaces();
    const { setSelectedPlace } = usePageState();
    const { places: allPlaces } = usePlacesContext();
    setter = (sel?: BasicPlace) => {
        setSelectedPlace(sel)};
    useEffect(() => {
        if (ref.current === null || filteredPlaces === undefined || map) {
            return;
        }
        console.log("places", filteredPlaces)
        const element = ref.current as HTMLDivElement | null;
        if (element) {
            const map = new mapboxgl.Map({
                container: element,
                style: 'mapbox://styles/newnottakenname/cl8xigw5t002s14pbpejhf6ug',
                zoom: 4,
                center: [5.55, 52.316667]
            });

            setMap(map);

            const create = () => {
                if (getAuth().collectionId) {
                    if (getAuth().collectionId) {
                        fitAllInBounds(map, filteredPlaces);
                    }
                    createPlaces(map, filteredPlaces);
                }
            }

            console.log(filteredPlaces.length);
            if (filteredPlaces.length > 0) {
                if (map.loaded()) {
                    create();
                } else {
                    map.on("load", create);
                }
            }

            const location = new GeolocateControl({
                showUserHeading: true,
                showAccuracyCircle: true,
                showUserLocation: true,
                trackUserLocation: true
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
                if (getAuth().collectionId) {
                }
            } else {
                map.on("load", () => {
                    createPlaces(map, filteredPlaces);
                    if (getAuth().collectionId) {
                        // fitAllInBounds(map, places);
                    }
                });
            }
        }
    }, [filteredPlaces])
    return <div ref={ref} className="w-screen h-[100dvh]"></div>
}