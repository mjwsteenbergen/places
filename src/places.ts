import mapboxgl, { GeolocateControl } from 'mapbox-gl';
import { Marker, Popup } from 'mapbox-gl';

type Place = {
    latitude: number;
    longitude: number;
    name: string;
    Link?: string;
    id: string;
    Type?: string;
}

const places: Place[] = [
    {
        latitude: 52.2434633,
        longitude: 5.6321481,
        name: "The middle of the Netherlands",
        id: "not exists",
    }
];

(mapboxgl as any).accessToken = 'pk.eyJ1IjoibmV3bm90dGFrZW5uYW1lIiwiYSI6ImNsOHhpOTQ0YzAycjAzcHAydGR2bmN5MTYifQ.aNK_O6pCnTXSkxNJ2DcdPQ';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/newnottakenname/cl8xigw5t002s14pbpejhf6ug',
    zoom: 6,
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
        closeOnMove: true,
        offset: [0, -37]
    }).setHTML(`<h1>${place.name}</h1>
    <p class="placetype">${place.Type}</p>
${place.Link ? `<p><a target="_blank" href="${place.Link}">View link</a></p>` : ""}
<p><a target="_blank" href="https://notion.so/${place.id}">Go to Notion</a></p>
<p><a target="_blank" href="https://www.google.com/maps/search/${place.latitude},${place.longitude}">Get Directions</a></p>`)
}


const createPlace = (place: Place) => {
    const div = document.createElement("div");
    div.innerHTML = `
<svg display="block" height="41px" width="27px" viewBox="0 0 27 41"><defs><radialGradient id="shadowGradient"><stop offset="10%" stop-opacity="0.4"></stop><stop offset="100%" stop-opacity="0.05"></stop></radialGradient></defs><ellipse cx="13.5" cy="34.8" rx="10.5" ry="5.25" fill="url(#shadowGradient)"></ellipse><path fill="#3FB1CE" d="M27,13.5C27,19.07 20.25,27 14.75,34.5C14.02,35.5 12.98,35.5 12.25,34.5C6.75,27 0,19.22 0,13.5C0,6.04 6.04,0 13.5,0C20.96,0 27,6.04 27,13.5Z"></path><path opacity="0.25" d="M13.5,0C6.04,0 0,6.04 0,13.5C0,19.22 6.75,27 12.25,34.5C13,35.52 14.02,35.5 14.75,34.5C20.25,27 27,19.07 27,13.5C27,6.04 20.96,0 13.5,0ZM13.5,1C20.42,1 26,6.58 26,13.5C26,15.9 24.5,19.18 22.22,22.74C19.95,26.3 16.71,30.14 13.94,33.91C13.74,34.18 13.61,34.32 13.5,34.44C13.39,34.32 13.26,34.18 13.06,33.91C10.28,30.13 7.41,26.31 5.02,22.77C2.62,19.23 1,15.95 1,13.5C1,6.58 6.58,1 13.5,1Z"></path><circle fill="white" cx="13.5" cy="13.5" r="5.5"></circle></svg>
<p class="placeName">${place.name}</p>
`

    new Marker({
        element: div,
        anchor: 'top-left',
        offset: [-14, -35.25]
    }).setLngLat([
        place.longitude,
        place.latitude
    ]).setPopup(popup(place))
        .addTo(map)
}

places.forEach(place => {
    createPlace(place);
});

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
        rep.Reply.Result.forEach(place => {
            createPlace(place);
        });
    })
} else {
    console.warn("no api key found. not loading in extra items");
}
