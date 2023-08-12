import { MapboxContext } from './context/mapbox-gl'
import { PlacesContext } from './context/places'
import { Map } from './map/map'
import { Overlay } from './components/overlay'
import { SideBar } from './components/sidebar/Sidebar'
import { PageStateContextProvider } from './context/page-state'
import { ErrorBoundary } from './components/errorBoundary'

export default function App() {

      return <PlacesContext>
          <MapboxContext>
            <PageStateContextProvider>
              <Map />
              <Overlay>
                <SideBar />
              </Overlay>
            </PageStateContextProvider>
          </MapboxContext>
        </PlacesContext>

      

  
}
