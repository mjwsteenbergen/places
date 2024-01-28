import { MapboxContext } from "./context/mapbox-gl";
import { Map } from "./map/map";
import { Overlay } from "./components/overlay";
import { SideBar } from "./components/sidebar/Sidebar";
import { PageStateContextProvider } from "./context/page-state";

import "./app.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

const createQueryClient = () => {
  const queryClient = new QueryClient();

  const localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage,
  });

  persistQueryClient({
    queryClient,
    persister: localStoragePersister,
  });
  return queryClient;
};

export default function App() {
  return (
    <QueryClientProvider client={createQueryClient()}>
      <PageStateContextProvider>
        <MapboxContext>
          <Map />
          <Overlay>
            <SideBar />
          </Overlay>
        </MapboxContext>
      </PageStateContextProvider>
    </QueryClientProvider>
  );
}
