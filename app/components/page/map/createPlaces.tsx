import mapbox, { type Map, type Popup } from "mapbox-gl";
import { isMobileView } from "./view";
import { renderToString } from "react-dom/server";
import { getStateSetter } from "./map";
import "./map.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import { type useNavigate } from "react-router";
import type { PlaceDTO } from "~/api/places/types";

export const createPlaces = (
  map: Map,
  places: PlaceDTO[],
  navigate: ReturnType<typeof useNavigate>
) => {
  const group: Record<string, PlaceDTO[]> = {};

  places.forEach((place) => {
    const name = place.type;
    console.log("name", name);

    if (!group[name ?? "unknown"]) {
      group[name ?? "unknown"] = [];
    }
    group[name ?? "unknown"].push(place);
  });

  console.log(
    "before",
    Object.keys(layerMap).filter((i) => map.getSource(i)),
    group,
    Object.keys(layerMap)
  );

  Object.keys(layerMap)
    .concat([""])
    .map((i) => "places-" + i)
    .filter((i) => map.getSource(i))
    .forEach((layer) => {
      console.log("removing", layer);
      map.removeLayer(layer);
      map.removeSource(layer);
    });

  console.log("after", Object.keys(layerMap), group);

  Object.keys(group).forEach((key) => {
    createLayer(group[key], map, key, navigate);
  });
};

export const fitAllInBounds = (map: Map, places: PlaceDTO[]) => {
  const minmax: [[number, number], [number, number]] = places.reduce(
    (minmax, cur) => {
      const [max, min] = minmax;
      if (cur.longitude > max[0]) {
        minmax[0][0] = cur.longitude;
      }

      if (cur.latitude > max[1]) {
        minmax[0][1] = cur.latitude;
      }

      if (cur.longitude < min[0]) {
        minmax[1][0] = cur.longitude;
      }

      if (cur.latitude < min[1]) {
        minmax[1][1] = cur.latitude;
      }

      return minmax;
    },
    [
      [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
      [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    ]
  );
  map.fitBounds(minmax, {
    maxZoom: 20,
    padding: padding(),
  });
};

const layerMap = {
  "Place to Visit": "rocket",
  "Place to Eat": "restaurant",
  "Vacation Highlight": "rocket",
  "Vacation Option": "rocket",
  WikipediaPlace: "attraction",
  "Atlas Obscura Place": "attraction",
  GoogleResultPlace: "attraction",
  Experience: "marker-stroked",
  City: "city",
  Museum: "museum",
  Housing: "building",
  "Point of interest": "dot-10",
  unknown: "rocket",
};

export const createLayer = (
  places: PlaceDTO[],
  map: Map,
  type: string,
  navigate: ReturnType<typeof useNavigate>
) => {
  console.log("Creating layer", type);

  const getSelectedPlace = (
    event: mapboxgl.MapMouseEvent & {
      features?: mapboxgl.MapboxGeoJSONFeature[];
    }
  ): PlaceDTO | undefined => {
    const features = map.queryRenderedFeatures(event.point, {
      layers: [mapId],
    });
    if (!features.length) {
      return;
    }
    const feature = features[0];
    return JSON.parse(feature.properties?.data ?? "{}") as PlaceDTO;
  };

  const mapId = "places-" + type;

  const geojson:
    | GeoJSON.Feature<GeoJSON.Geometry>
    | GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
    type: "FeatureCollection",
    features: places.map((place) => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [place.longitude, place.latitude],
        },
        properties: {
          data: JSON.stringify(place),
        },
      };
    }),
  };

  map.getLayer(mapId) && map.removeLayer(mapId);
  map.getSource(mapId) && map.removeSource(mapId);

  map.addSource(mapId, {
    type: "geojson",
    data: geojson,
    generateId: true,
  });

  const iconImage = (layerMap as any)[type ?? "unkown"] ?? "rocket";

  map.addLayer({
    id: mapId,
    type: "symbol",
    source: mapId,
    layout: {
      "icon-image": iconImage,
      "icon-size": iconImage === "place-low" ? 1.0 : 1.5,
      "icon-allow-overlap": true,
      "icon-anchor": "center",
      "text-optional": true,
      "text-anchor": "top",
      "text-offset": [0, 0.75],
      "text-field": ["format", ["get", "Name"]],
    },
  });

  // const popup = new mapbox.Popup({
  //     // closeOnMove: true,
  //     // offset: [0, -10]
  // })

  const popup = new mapbox.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  map.addInteraction(mapId + "-mouseenter-interaction", {
    type: "mouseenter",
    target: { layerId: mapId },
    handler: (e) => {
      map.getCanvas().style.cursor = "pointer";

      // Copy the coordinates from the POI underneath the cursor
      const coordinates = e.feature?.geometry.coordinates.slice();

      console.log("coords", coordinates);
      const place = getSelectedPlace(e);
      if (place) {
        const header = <h1>{place.name}</h1>;

        const hero = !place.cover ? (
          header
        ) : (
          <div
            className="popup_background"
            style={{
              backgroundImage: `linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0),
                rgba(0, 0, 0, 0.4)
            ), url(${place.cover})`,
            }}
          >
            {header}
          </div>
        );

        // Populate the popup and set its coordinates based on the feature found.
        popup
          .setLngLat(coordinates)
          .setHTML(
            renderToString(
              <>
                {hero}
                <div className="desc-container">
                  <p className="placetype">{place.type}</p>
                </div>
              </>
            )
          )
          .addTo(map);
      }
    },
  });

  map.addInteraction(
    mapId.toLowerCase().replaceAll(" ", "-") + "-mouseleave-interaction",
    {
      type: "mouseleave",
      target: { layerId: mapId },
      handler: () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
      },
    }
  );

  map.addInteraction(mapId.toLowerCase().replaceAll(" ", "-") + "-click", {
    type: "click",
    target: { layerId: mapId },
    handler: (e) => {
      navigate(`/place/${getSelectedPlace(e)?.id}`);
    },
  });

  // Change the cursor to a pointer when the it enters a feature in the 'circle' layer.
  // map.on('mouseenter', mapId, (event) => {
  //     const props = getSelectedPlace(event);
  //     if (!currentPopup) {
  //         currentPopup = popup(props!);
  //         currentPopup.addTo(map);
  //         console.log("added popup")
  //     }
  //     map.getCanvas().style.cursor = 'pointer';
  // });

  // // Change it back to a pointer when it leaves.
  // map.on('mouseleave', mapId, () => {
  //     map.getCanvas().style.cursor = '';
  //     currentPopup?.remove();
  //     currentPopup = undefined;
  // });

  // map.on('click', mapId, (event) => {
  //     const props = getSelectedPlace(event)!;
  //     getStateSetter()(props);
  // });
};

const popup = (place: PlaceDTO) => {
  console.log(JSON.stringify(place));

  const header = `<h1>${place.name}</h1>`;
  const hero = !place.cover
    ? header
    : `<div class="popup_background" style="background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.4)
  ), url(${place.cover})">
        ${header}
    </div>`;

  // ${place.short ? `<h3>${place.short}</h3>` : ""}

  return new mapbox.Popup({
    // closeOnMove: true,
    offset: [0, -10],
  }).setLngLat([place.longitude, place.latitude]).setHTML(`${hero}
        <div class="desc-container">
    <p class="placetype">${place.type}</p></div>`);
};

function padding() {
  return isMobileView()
    ? {
        bottom: 100,
        left: 10,
        right: 10,
        top: 10,
      }
    : {
        bottom: 100,
        left: 100,
        right: 500,
        top: 100,
      };
}
