import mapboxgl, {type Map} from "mapbox-gl";

export const onLoad = (map: Map) => {


    map.on('load', () => {
      map.addSource('places', {
        type: 'geojson',
        generateId: true,
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                description:
                  '<strong>Muhsinah</strong><p>Jazz-influenced hip hop artist Muhsinah plays the Black Cat (1811 14th Street NW) tonight with Exit Clov and Gods’illa. 9:00 p.m. $12.</p>'
              },
              geometry: {
                type: 'Point',
                coordinates: [-77.031706, 38.914581]
              }
            },
            {
              type: 'Feature',
              properties: {
                description:
                  "<strong>A Little Night Music</strong><p>The Arlington Players' production of Stephen Sondheim's <em>A Little Night Music</em> comes to the Kogod Cradle at The Mead Center for American Theater (1101 6th Street SW) this weekend and next. 8:00 p.m.</p>"
              },
              geometry: {
                type: 'Point',
                coordinates: [-77.020945, 38.878241]
              }
            },
            {
              type: 'Feature',
              properties: {
                description:
                  '<strong>Truckeroo</strong><p>Truckeroo brings dozens of food trucks, live music, and games to half and M Street SE (across from Navy Yard Metro Station) today from 11:00 a.m. to 11:00 p.m.</p>'
              },
              geometry: {
                type: 'Point',
                coordinates: [-77.007481, 38.876516]
              }
            }
          ]
        }
      });

      map.addLayer({
        id: 'places',
        type: 'circle',
        source: 'places',
        paint: {
          'circle-color': '#4264fb',
          'circle-radius': 6,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      map.addInteraction('places-mouseenter-interaction', {
        type: 'mouseenter',
        target: { layerId: 'places' },
        handler: (e) => {
          map.getCanvas().style.cursor = 'pointer';

          // Copy the coordinates from the POI underneath the cursor
          const coordinates = e.feature.geometry.coordinates.slice();
          const description = e.feature.properties.description;

          // Populate the popup and set its coordinates based on the feature found.
          popup
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
        }
      });

      map.addInteraction('places-mouseleave-interaction', {
        type: 'mouseleave',
        target: { layerId: 'places' },
        handler: () => {
          map.getCanvas().style.cursor = '';
          popup.remove();
        }
      });
    });
}