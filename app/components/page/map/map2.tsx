import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

const MapboxExample = () => {
  const mapContainerRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    // TO MAKE THE MAP APPEAR YOU MUST
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com
    mapboxgl.accessToken =
      "pk.eyJ1IjoibmV3bm90dGFrZW5uYW1lIiwiYSI6ImNsOHhpOTQ0YzAycjAzcHAydGR2bmN5MTYifQ.aNK_O6pCnTXSkxNJ2DcdPQ";

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [-77.04, 38.907],
      zoom: 11.15,
    });

    mapRef.current.on("load", () => {
      mapRef.current.addSource("places", {
        type: "geojson",
        generateId: true,
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                description:
                  "<strong>Muhsinah</strong><p>Jazz-influenced hip hop artist Muhsinah plays the Black Cat (1811 14th Street NW) tonight with Exit Clov and Gods’illa. 9:00 p.m. $12.</p>",
              },
              geometry: {
                type: "Point",
                coordinates: [-77.031706, 38.914581],
              },
            },
            {
              type: "Feature",
              properties: {
                description:
                  "<strong>A Little Night Music</strong><p>The Arlington Players' production of Stephen Sondheim's <em>A Little Night Music</em> comes to the Kogod Cradle at The Mead Center for American Theater (1101 6th Street SW) this weekend and next. 8:00 p.m.</p>",
              },
              geometry: {
                type: "Point",
                coordinates: [-77.020945, 38.878241],
              },
            },
            {
              type: "Feature",
              properties: {
                description:
                  "<strong>Truckeroo</strong><p>Truckeroo brings dozens of food trucks, live music, and games to half and M Street SE (across from Navy Yard Metro Station) today from 11:00 a.m. to 11:00 p.m.</p>",
              },
              geometry: {
                type: "Point",
                coordinates: [-77.007481, 38.876516],
              },
            },
          ],
        },
      });

      mapRef.current.addLayer({
        id: "places",
        type: "circle",
        source: "places",
        paint: {
          "circle-color": "#4264fb",
          "circle-radius": 6,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      mapRef.current.addInteraction("places-mouseenter-interaction", {
        type: "mouseenter",
        target: { layerId: "places" },
        handler: (e) => {
          mapRef.current.getCanvas().style.cursor = "pointer";

          // Copy the coordinates from the POI underneath the cursor
          const coordinates = e.feature.geometry.coordinates.slice();
          const description = e.feature.properties.description;

          // Populate the popup and set its coordinates based on the feature found.
          popup
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(mapRef.current);
        },
      });

      mapRef.current.addInteraction("places-mouseleave-interaction", {
        type: "mouseleave",
        target: { layerId: "places" },
        handler: () => {
          mapRef.current.getCanvas().style.cursor = "";
          popup.remove();
        },
      });
    });
  }, []);

  return (
    <>
      <div
        id="map"
        ref={mapContainerRef}
        style={{ height: "100vh", width: "100vw" }}
      ></div>
    </>
  );
};

export default MapboxExample;
