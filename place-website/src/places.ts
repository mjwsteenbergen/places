import { GeolocateControl, Popup } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';

type Place = {
    latitude: number;
    longitude: number;
    name: string;
    link?: string;
    id: string;
    type?: Tag;
}

type Tag = {
    id: string;
    name: string;
    color: string;
}

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

const popup = (place: Place) => {
    return new Popup({
        offset: [0, -37]
    }).setHTML(`<h1>${place.name}</h1>
    <p class="placetype">${place.type?.name ? place.type.name : ""}</p>
${place.link ? `<p><a target="_blank" href="${place.link}">View link</a></p>` : ""}
<p><a target="_blank" href="https://notion.so/${place.id}">Go to Notion</a></p>
<p><a target="_blank" href="https://www.google.com/maps/search/${place.latitude},${place.longitude}">Get Directions</a></p>`)
}

const createPlaces = (places: Place[]) => {
    const group: Record<string, Place[]> = {};

    places.forEach(place => {
        if (!group[place.type?.name ?? "unknown"]) {
            group[place.type?.name ?? "unknown"] = [];
        }
        group[place.type?.name ?? "unknown"].push(place);
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

const createLayer = (places: Place[], type: string) => {
    const mapId = 'places-' + type;


    const geojson: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> = 
        {
            'type': 'FeatureCollection',
            'features': places.map(place => {
                return {
                    'type': 'Feature',
                    'geometry': {
                            'type': 'Point',
                            'coordinates': [place.longitude, place.latitude],
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
                ['get', 'name'],
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
        const coords = (feature.geometry as any).coordinates;

        map.flyTo({
            center: coords,
            zoom: map.getZoom() < 14 ? 14 : map.getZoom(),
        })

        popup(feature.properties as Place)
            .setLngLat(coords)
            .addTo(map);
    });
}



type Reply = {
    Result: Place[]
}

let paramString = window.location.href.split('?')[1];
let queryString = new URLSearchParams(paramString);
if (queryString.has("token")) {
    localStorage.setItem("zeuskey", queryString.get("token") || "");
}

if (localStorage.getItem("zeuskey")) {
    fetch(`https://zeus-laurentia.azurewebsites.net/api/run/places?token=${localStorage.getItem("zeuskey")}`, {
    }).then(i => i.json()).then(reply => {
        const rep = reply as { Reply: Reply };
        createPlaces(rep.Reply.Result);
    })
} else {
    console.warn("no api key found. not loading in extra items");
}
