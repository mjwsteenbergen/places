import './design-system/tailwind.css'
import { MapboxContext } from './context/mapbox-gl'
import { PlacesContext } from './context/places'
import { Map } from './map/map'
import { Overlay } from './components/overlay'
import { SideBar2 } from './components/sidebar'
import { PageStateContextProvider } from './context/page-state'
import { ErrorBoundary } from './components/errorBoundary'

export default function App() {

      return <ErrorBoundary>
        <PlacesContext>
          <MapboxContext>
            <PageStateContextProvider>
              <Map />
              <Overlay>
                <SideBar2 />
              </Overlay>
            </PageStateContextProvider>
          </MapboxContext>
        </PlacesContext>

      </ErrorBoundary>

  
}
