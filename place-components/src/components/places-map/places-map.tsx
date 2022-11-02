import { Component, Method, Element, Fragment, h } from '@stencil/core';
import { GeolocateControl, Map } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import { getPlaces, getAuth } from '../../utils/endpoint';
import { LocalControl } from '../../utils/local-control';
import { createPlaces } from './createPlaces';

(mapboxgl as any).accessToken = 'pk.eyJ1IjoibmV3bm90dGFrZW5uYW1lIiwiYSI6ImNsOHhpOTQ0YzAycjAzcHAydGR2bmN5MTYifQ.aNK_O6pCnTXSkxNJ2DcdPQ';

@Component({
  tag: 'places-map',
  styleUrl: "places-map.scss",
  shadow: false,
})
export class PlacesMap {

  map: Map;

  @Element()
  element: HTMLElement;

  connectedCallback() {
    this.map = new mapboxgl.Map({
      container: this.element,
      style: 'mapbox://styles/newnottakenname/cl8xigw5t002s14pbpejhf6ug',
      zoom: 4,
      center: [5.55, 52.316667]
    });

    getPlaces().then(reply => createPlaces(this.map, reply.Reply.Result))

    const location = new GeolocateControl({
      showUserHeading: true,
      showAccuracyCircle: true,
      showUserLocation: true,
      trackUserLocation: true
    });

    this.map.addControl(location);

    if (getAuth().token) {
      this.map.addControl(new LocalControl());
    }
  }

  @Method()
  getMap() {
    return Promise.resolve(this.map);
  }

  render() {
    return <Fragment/>;
  }

}
