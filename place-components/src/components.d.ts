/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface PlaceDetails {
        "pageId": string;
    }
}
declare global {
    interface HTMLPlaceDetailsElement extends Components.PlaceDetails, HTMLStencilElement {
    }
    var HTMLPlaceDetailsElement: {
        prototype: HTMLPlaceDetailsElement;
        new (): HTMLPlaceDetailsElement;
    };
    interface HTMLElementTagNameMap {
        "place-details": HTMLPlaceDetailsElement;
    }
}
declare namespace LocalJSX {
    interface PlaceDetails {
        "pageId"?: string;
    }
    interface IntrinsicElements {
        "place-details": PlaceDetails;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "place-details": LocalJSX.PlaceDetails & JSXBase.HTMLAttributes<HTMLPlaceDetailsElement>;
        }
    }
}
