import { getAuth, BasicPlace } from "../endpoint";
import { Map, Popup } from 'mapbox-gl';
import { isMobileView } from "./view";
import { getStateSetter } from "./map";

export const createPlaces = (map: Map, places: BasicPlace[]) => {
    const group: Record<string, BasicPlace[]> = {};

    places.forEach(place => {
        const name = place.Type;

        if (!group[name ?? "unknown"]) {
            group[name ?? "unknown"] = [];
        }
        group[name ?? "unknown"].push(place);
    })

    console.log("before", Object.keys(layerMap).filter(i => map.getSource(i)), group, Object.keys(layerMap))

    Object.keys(layerMap).concat([""]).map(i => "places-" + i).filter(i => map.getSource(i)).forEach(layer => {
        console.log("removing", layer);
        map.removeLayer(layer);
        map.removeSource(layer);
    });

    console.log("after", Object.keys(layerMap), group)

    Object.keys(group).forEach(key => {
        createLayer(group[key], map, key);
    });
}

export const fitAllInBounds = (map: Map, places: BasicPlace[]) => {
    const minmax: [[number, number], [number, number]] = places.reduce((minmax, cur) => {
        const [max, min] = minmax;
        if (cur.Longitude > max[0]) {
            minmax[0][0] = cur.Longitude;
        }

        if (cur.Latitude > max[1]) {
            minmax[0][1] = cur.Latitude
        }

        if (cur.Longitude < min[0]) {
            minmax[1][0] = cur.Longitude;
        }

        if (cur.Latitude < min[1]) {
            minmax[1][1] = cur.Latitude;
        }


        return minmax;
    }, [[Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER], [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]])
    map.fitBounds(minmax, {
        maxZoom: 20,
        padding: padding()
    })
}

const layerMap = {
    "Place to Visit": "rocket",
    "Place to Eat": "restaurant",
    "Vacation Highlight": "rocket",
    "Vacation Option": "rocket",
    "WikipediaPlace": "attraction",
    "Atlas Obscura Place": "attraction",
    "GoogleResultPlace": "attraction",
    "Experience": "marker-stroked",
    "City": "city",
    "Museum": "museum",
    "Housing": "building",
    "Point of interest": "dot-10",
    "unknown": "rocket"
};

let currentPopup: Popup| undefined = undefined

export const createLayer = (places: BasicPlace[], map: Map, type: string) => {
    console.log("Creating layer", type)
    
    const getSelectedPlace = (event: mapboxgl.MapMouseEvent & {
        features?: mapboxgl.MapboxGeoJSONFeature[];
    }): BasicPlace|undefined => {
        const features = map.queryRenderedFeatures(event.point, {
            layers: [mapId]
        });
        if (!features.length) {
            return;
        }
        const feature = features[0]; 
        return feature.properties as BasicPlace;
    }

    const mapId = 'places-' + type;


    const geojson: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> =
    {
        'type': 'FeatureCollection',
        'features': places.map(place => {
            return {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [place.Longitude, place.Latitude],
                },
                "properties": place
            }
        })
    }


    map.getLayer(mapId) && map.removeLayer(mapId);
    map.getSource(mapId) && map.removeSource(mapId);


    map.addSource(mapId, {
        type: 'geojson',
        data: geojson
    });

    const iconImage = (layerMap as any)[type ?? "unkown"] ?? "rocket";

    map.addLayer({
        'id': mapId,
        'type': 'symbol',
        'source': mapId,
        'layout': {
            'icon-image': iconImage,
            'icon-size': iconImage === "place-low" ? 1.0 : 1.5,
            'icon-allow-overlap': true,
            'icon-anchor': 'center',
            'text-optional': true,
            'text-anchor': 'top',
            'text-offset': [0, 0.75],
            'text-field': ['format',
                ['get', 'Name'],
            ],
        }
    });

    // Change the cursor to a pointer when the it enters a feature in the 'circle' layer.
    map.on('mouseenter', mapId, (event) => {
        const props = getSelectedPlace(event);
        if (!currentPopup) {
            currentPopup = popup(props!);
            currentPopup.addTo(map);
        }
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', mapId, () => {
        map.getCanvas().style.cursor = '';
        currentPopup?.remove();
        currentPopup = undefined;
    });

    map.on('click', mapId, (event) => {
        const props = getSelectedPlace(event)!;        
        getStateSetter()(props);
    });
}

const popup = (place: BasicPlace) => {
    const header = `<h1>${place.Name}</h1>`
    const hero = !place.imageUrl ? header : `<div class="popup_background" style="background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.4)
  ), url(${place.imageUrl})">
        ${header}
    </div>`

    return new Popup({
        closeOnMove: true,
        offset: [0, -10]
    })
        .setLngLat([place.Longitude, place.Latitude])
        .setHTML(`${hero}
        <div class="desc-container">
        ${place.short ? `<h3>${place.short}</h3>` : ""}
    <p class="placetype">${place.Type}</p></div>`)
}

function padding() {
    return isMobileView() ? {
        bottom: 100,
        left: 10,
        right: 10,
        top: 10
    } : {
        bottom: 100,
        left: 100,
        right: 500,
        top: 100
    };
}
