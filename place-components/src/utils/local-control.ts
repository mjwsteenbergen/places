import { Map } from "mapbox-gl";

export class LocalControl {
    private _map!: Map;
    private _container!: HTMLDivElement;

    onAdd(map: Map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl';

        const button = document.createElement("button");
        button.onclick = () => {
            const text = document.getElementById("text")!;
            text.innerHTML = "";

            const el = document.createElement("local-places");
            el.setAttribute("latitude", this._map.getCenter().lat.toString());
            el.setAttribute("longitude", this._map.getCenter().lng.toString());
            text.appendChild(el);
        }

        button.textContent = 'Find Local';

        this._container.appendChild(button);


        return this._container;
    }

    getDefaultPosition(): string {
        return 'top-right';
    }

    onRemove() {
        this._container.parentNode?.removeChild(this._container);
        (this._map as any) = undefined;
    }
}