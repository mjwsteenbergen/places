import { Component, h, Prop, Element, State, Event, EventEmitter } from '@stencil/core';
import { getPlace, WikipediaData } from '../../utils/endpoint';
import type { PlaceDetails } from '../../utils/endpoint';

type MapOptions = {
  center: [number, number],
  zoom: number
}

@Component({
  tag: 'place-details',
  styleUrl: "place-details.scss",
  shadow: true,
})
export class PlaceDetailsComp {
  @Prop({
    attribute:"pageid"
  }) pageId: string;

  @Prop({
    attribute: "map-options"
  }) mapOptions?: string;

  @Prop() place: PlaceDetails;

  @State() state: PlaceDetails;

  @Element() el: HTMLElement;

  @Event() detailClose: EventEmitter;


  connectedCallback() {
    if (this.pageId) {
      getPlace(this.pageId).then(i => {
        this.state = i.Reply.Result;
      })
    } else if (this.place) {
      this.state = this.place;
    }
  }



  render() {
    if (!this.state) {
      return "";
    }

    const { PageText, PlaceProps, Wikipedia } = this.state;

    return (
      <section>
        <ul class="bullets">
          {PlaceProps.type?.name && <li class="special">{PlaceProps.type.name}</li>}
          {PlaceProps.visited && <li class="special">Have been</li>}
          {PlaceProps.tags?.map(tag => <li class="special" data-id={tag.id}>{tag.name}</li>)}
          {PlaceProps.link ? <li><a target="_blank" href={PlaceProps.link}>View link ↗</a></li> : ""}
          <li><a target="_blank" href={"https://www.google.com/maps/search/" + PlaceProps.latitude + "," + PlaceProps.longitude}>Directions ↗</a></li>          
        </ul>
        <button class="close-button" onClick={() => this.close()}><ion-icon name="close" size="large"></ion-icon></button>
        <h1>{PlaceProps.name}</h1>
        {this.getContent(PageText)}
        {this.getWiki(Wikipedia)}
        {PlaceProps.id && <div class="notion-button-container"><a class="notion-button" target="_blank" href={"https://notion.so/" + PlaceProps.id}>Go to Notion</a></div>}
      </section>
    );
  }

  close() {
    this.detailClose.emit();
    this.el.parentElement?.removeChild(this.el);
    if (this.mapOptions) {
      const mapOptions = JSON.parse(this.mapOptions) as MapOptions;
      document.getElementsByTagName("places-map")[0].getMap().then(map => map.easeTo(mapOptions))
    }
  }

  getContent(content: string) {
    if (content && content !== "undefined") {
      return <div>
        <h2>Notion</h2>
        <div innerHTML={content}></div>
      </div>
    }
  }

  getWiki(data: WikipediaData) {
    if (data) {
      return <div>
        <h2>Wikipedia</h2>
        <details>
          <summary>
            <div innerHTML={data.text}></div>
          </summary>
        </details>
        <a target="_blank" href={data.url}>Read on Wikipedia</a>
      </div>
    }
    return undefined;
  }
}

