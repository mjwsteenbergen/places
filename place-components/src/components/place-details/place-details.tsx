import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'place-details',
  styleUrl: "place-details.scss",
  shadow: true,
})
export class PlaceDetails {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
