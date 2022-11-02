import { getAuth, PlaceOverview } from "../../utils/endpoint";
import { Map } from 'mapbox-gl';

export const createPlaces = (map: Map, places: PlaceOverview[]) => {
    const group: Record<string, PlaceOverview[]> = {};

    places.forEach(place => {
        const name = place.Type;

        if (!group[name ?? "unknown"]) {
            group[name ?? "unknown"] = [];
        }
        group[name ?? "unknown"].push(place);
    })

    Object.keys(group).forEach(key => {
        createLayer(group[key], map, key);
    });

    if (getAuth().collectionId) {
       fitAllInBounds(map, places)
    }
}

export const fitAllInBounds = (map: Map, places: PlaceOverview[]) => {
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
            console.log("min", cur.Name)
            minmax[1][1] = cur.Latitude;
        }


        return minmax;
    }, [[Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER], [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]])
    map.fitBounds(minmax, {
        padding: {
            bottom: 100,
            left: 100,
            right: 100,
            top: 100
        }
    })
}

const layerMap = {
    "Place to visit": "attraction",
    "Place to eat": "restaurant",
    "Vacation Highlight": "embassy",
    "WikipediaPlace": "attraction",
    "unknown": "rocket"
};

export const createLayer = (places: PlaceOverview[], map:Map, type: string) => {
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

    map.addLayer({
        'id': mapId,
        'type': 'symbol',
        'source': mapId,
        'layout': {
            'icon-image': (layerMap as any)[type ?? "unkown"] ?? "rocket",
            'icon-size': 1.5,
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
    map.on('mouseenter', mapId, () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', mapId, () => {
        map.getCanvas().style.cursor = '';
    });

    map.on('click', mapId, (event) => {
        const features = map.queryRenderedFeatures(event.point, {
            layers: [mapId]
        });
        if (!features.length) {
            return;
        }

        const feature = features[0];

        onClick(feature.properties as PlaceOverview);
    });
}

const onClick = (place: PlaceOverview) => {
    if (!place) {
        return;
    }

    const text = document.getElementById("text")!;
    text.innerHTML = "";

    const el = document.createElement("place-details");
    el.setAttribute("pageId", place.Id);
    text.appendChild(el);
}