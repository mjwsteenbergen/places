import { MapboxContext } from "./context/mapbox-gl";
import { PlacesContext } from "./context/places";
import { Map } from "./map/map";
import { Overlay } from "./components/overlay";
import { SideBar } from "./components/sidebar/Sidebar";
import { PageStateContextProvider } from "./context/page-state";

import "./app.scss";

export default function App() {
  return (
    <PlacesContext>
      <PageStateContextProvider>
        <MapboxContext>
          <Map />
          <Overlay>
            <SideBar />
          </Overlay>
        </MapboxContext>
      </PageStateContextProvider>
    </PlacesContext>
  );
}
