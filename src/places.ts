import mapboxgl from 'mapbox-gl';
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

(mapboxgl as any).accessToken = 'pk.eyJ1IjoibmV3bm90dGFrZW5uYW1lIiwiYSI6ImNrZjhuZzZvZjA2MDUyd3B4MmdkMzhpamEifQ.3p91vKWfOce6fRzddTg_qA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/newnottakenname/ckf8o4w885kx21and6jq56h8q',
    zoom: 6,
    center: [5.55, 52.316667]
});

const popup = (place: Place) => {
    return new Popup({
        closeOnMove: true
    }).setHTML(`<h1>${place.name}</h1>
    <p class="placetype">${place.Type}</p>
${place.Link ? `<p><a target="_blank" href="${place.Link}">View link</a></p>` : ""}
<p><a target="_blank" href="${place.id}">Go to Notion<a></p>`)
}

places.forEach(place => {
    new Marker({

    }).setLngLat([
        place.longitude,
        place.latitude
    ]).setPopup(popup(place))
        .addTo(map)
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
            new Marker({

            }).setLngLat([
                place.longitude,
                place.latitude
            ]).setPopup(popup(place))
                .addTo(map)
        });
    })
} else {
    console.warn("no api key found. not loading in extra items");
}
