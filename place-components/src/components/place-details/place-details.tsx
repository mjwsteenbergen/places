import { Component, h, Prop, Element, State, Watch } from '@stencil/core';
import { getPlace } from '../../../../place-website/src/endpoint';
import type { PlaceDetails as PlaceDetailsType } from '../../../../place-website/src/endpoint';


@Component({
  tag: 'place-details',
  styleUrl: "place-details.scss",
  shadow: true,
})
export class PlaceDetails {
  @Prop({
    attribute:"pageid"
  }) pageId: string;
  
  @Watch('pageid')
  validateName(newValue: string, _oldValue: string) {
    // getPlace(newValue).then(i => {
    //   this.state = i.Reply.Result;
    // })
  }

  @State() state: PlaceDetailsType;

  @Element() el: HTMLElement;

  connectedCallback() {
    getPlace(this.pageId).then(i => {
      this.state = i.Reply.Result;
    })
  }

  render() {
    if (!this.state) {
      return "";
    }

    const { PageText, PlaceProps, Wikipedia } = this.state;

    return (
      <section>
        <ul class="bullets">
          <li class="placetype">{PlaceProps.type?.name ? PlaceProps.type.name : ""}</li>
          {PlaceProps.link ? <li><a target="_blank" href={PlaceProps.link}>View link ↗</a></li> : ""}
          <li><a target="_blank" href={"https://www.google.com/maps/search/" + PlaceProps.latitude + "," + PlaceProps.longitude}>Directions ↗</a></li>          
        </ul>
        <button class="close-button" onClick={() => this.close()}><ion-icon name="close" size="large"></ion-icon></button>
        <h1>{PlaceProps.name}</h1>
        {this.getContent(PageText)}
        {this.getWiki(Wikipedia)}
        <div class="notion-button-container"><a class="notion-button" target="_blank" href={"https://notion.so/" + PlaceProps.id}>Go to Notion</a></div>
      </section>
    );
  }

  close() {
    this.el.parentElement.removeChild(this.el);
  }

  getContent(content: string) {
    if (content && content !== "undefined") {
      return <div>
        <h2>Notion</h2>
        <div innerHTML={content}></div>
      </div>
    }
  }

  getWiki(input: string) {
    if (input) {
      return <div>
        <h2>Wikipedia</h2>
        <div innerHTML={input}></div>
      </div>
    }
    return undefined;
  }
}

