import { Component, h, State, Prop, Listen, Fragment, Element } from '@stencil/core';
import { getLocalPlaces, getPlace, PlaceDetails, BasicPlace } from '../../utils/endpoint';
import { createLayer, fitAllInBounds } from '../places-map/createPlaces';

@Component({
  tag: 'local-places',
  styleUrl: "local-places.scss",
  shadow: true,
})
export class LocalPlaces {

  @State() selected: PlaceDetails;
  @State() places: BasicPlace[];

  @Prop() latitude: number;
  @Prop() longitude: number;

  @Element() el: HTMLElement;

  @Listen('detailClose')
  closeDetails() {
    this.selected = undefined
  }


  connectedCallback() {
    getLocalPlaces(this.latitude, this.longitude).then(async i => {
      this.places = i.Reply.Result;

      const mapComponent = document.getElementsByTagName("places-map")[0];
      const map = await mapComponent.getMap();

      createLayer(this.places, map, "WikipediaPlace");  
      fitAllInBounds(map, this.places);

      setTimeout(() => {
        fitAllInBounds(map, this.places);
      }, 3000);

    })
    this.places = [];
  }

  close() {
    this.el.parentElement?.removeChild(this.el);
  }

  render() {
    if (this.selected) {
      return <place-details place={this.selected as any}/>
    }
    return (
      <Fragment>
        <button class="close-button" onClick={() => this.close()}><ion-icon name="close" size="large"></ion-icon></button>
        <ul>
          {this.places.map(place => {
            return <li onClick={() => {
              getPlace(place.Id).then(response => {
                this.selected = response.Reply.Result;
              })
            }
            }>
              <h1>{place.Name}</h1>
              <p innerHTML={place.summary}></p>
              {place.imageUrl && <img src={place.imageUrl}></img>}
            </li>
          })}
        </ul>
      </Fragment>
      
    );
  }

}
