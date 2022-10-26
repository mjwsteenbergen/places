import { Component, h, State, Prop, Listen, Fragment, Element } from '@stencil/core';
import { getLocalPlaces, PlaceDetails } from '../../../../place-website/src/endpoint';

@Component({
  tag: 'local-places',
  styleUrl: "local-places.scss",
  shadow: true,
})
export class LocalPlaces {

  @State() selected: PlaceDetails;
  @State() places: PlaceDetails[];

  @Prop() latitude: number;
  @Prop() longitude: number;

  @Element() el: HTMLElement;

  @Listen('detailClose')
  closeDetails() {
    this.selected = undefined
  }


  connectedCallback() {
    console.log("check");
    getLocalPlaces(this.latitude, this.longitude).then(i => {
      this.places = i.Reply.Result;
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
              this.selected = place;
            }
            }>
              <h1>{place.PlaceProps.name}</h1>
              <p innerHTML={place.Wikipedia.summary}></p>
              {place.imageUrl && <img src={place.imageUrl}></img>}
            </li>
          })}
        </ul>
      </Fragment>
      
    );
  }

}
