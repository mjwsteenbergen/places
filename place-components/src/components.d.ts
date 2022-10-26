/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { PlaceDetails } from "../../place-website/src/endpoint";
export namespace Components {
    interface LocalPlaces {
        "latitude": number;
        "longitude": number;
    }
    interface PlaceDetails {
        "pageId": string;
        "place": PlaceDetails;
    }
}
export interface PlaceDetailsCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPlaceDetailsElement;
}
declare global {
    interface HTMLLocalPlacesElement extends Components.LocalPlaces, HTMLStencilElement {
    }
    var HTMLLocalPlacesElement: {
        prototype: HTMLLocalPlacesElement;
        new (): HTMLLocalPlacesElement;
    };
    interface HTMLPlaceDetailsElement extends Components.PlaceDetails, HTMLStencilElement {
    }
    var HTMLPlaceDetailsElement: {
        prototype: HTMLPlaceDetailsElement;
        new (): HTMLPlaceDetailsElement;
    };
    interface HTMLElementTagNameMap {
        "local-places": HTMLLocalPlacesElement;
        "place-details": HTMLPlaceDetailsElement;
    }
}
declare namespace LocalJSX {
    interface LocalPlaces {
        "latitude"?: number;
        "longitude"?: number;
    }
    interface PlaceDetails {
        "onDetailClose"?: (event: PlaceDetailsCustomEvent<any>) => void;
        "pageId"?: string;
        "place"?: PlaceDetails;
    }
    interface IntrinsicElements {
        "local-places": LocalPlaces;
        "place-details": PlaceDetails;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "local-places": LocalJSX.LocalPlaces & JSXBase.HTMLAttributes<HTMLLocalPlacesElement>;
            "place-details": LocalJSX.PlaceDetails & JSXBase.HTMLAttributes<HTMLPlaceDetailsElement>;
        }
    }
}
