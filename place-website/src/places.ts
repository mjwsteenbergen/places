import { GeolocateControl, Point, Popup } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import text from './text.json';
import { getPlaces } from './endpoint';
import type { PlaceOverview } from './endpoint';

(mapboxgl as any).accessToken = 'pk.eyJ1IjoibmV3bm90dGFrZW5uYW1lIiwiYSI6ImNsOHhpOTQ0YzAycjAzcHAydGR2bmN5MTYifQ.aNK_O6pCnTXSkxNJ2DcdPQ';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/newnottakenname/cl8xigw5t002s14pbpejhf6ug',
    zoom: 4,
    center: [5.55, 52.316667]
});

const location = new GeolocateControl({
    showUserHeading: true,
    showAccuracyCircle: true,
    showUserLocation: true,
    trackUserLocation: true
});

map.addControl(location);

const onClick = (place: PlaceOverview) => {
    if (!place) {
        return;
    }

    const text = document.getElementById("text")!;
    text.innerHTML = "";

    const el = document.createElement("place-details");
    el.setAttribute("pageId", place.Id);
    // el.setAttribute("wiki", place.Wikipedia);
    // el.setAttribute("content", place.PageText);
    // el.setAttribute("props", JSON.stringify(place.PlaceProps));

    text.appendChild(el);
}

const createPlaces = (places: PlaceOverview[]) => {
    const group: Record<string, PlaceOverview[]> = {};

    places.forEach(place => {
        const name = place.Type;

        if (!group[name ?? "unknown"]) {
            group[name ?? "unknown"] = [];
        }
        group[name ?? "unknown"].push(place);
    })

    Object.keys(group).forEach(key => {
        createLayer(group[key], key);
    })
}

const layerMap = {
    "Place to visit": "attraction",
    "Place to eat": "restaurant",
    "Vacation Highlight": "marker",
    "unknown": "rocket"
};

const createLayer = (places: PlaceOverview[], type: string) => {
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

let paramString = window.location.href.split('?')[1];
let queryString = new URLSearchParams(paramString);
if (queryString.has("token")) {
    localStorage.setItem("zeuskey", queryString.get("token") || "");
}

// map.on('load', () => {
//     createPlaces(text.Reply.Result as any as PlaceOverview[]);
// })

getPlaces().then(reply => createPlaces(reply.Reply.Result))
