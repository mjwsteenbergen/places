import { getPlaces } from "~/api/notion/api";
import type { Route } from "../+types/page-wrapper";
import { Map } from "../components/page/map/map";
import { MapboxContext } from "~/context/mapbox-gl";
import { Outlet } from "react-router";
import { withSessionClient } from "~/appwrite/server";
import {
  DisplayedPlacesContextProvider,
  PlacesContextProvider,
} from "~/context/displayed-places";
import { getAllowedPlaces, updatePlacesCollection } from "~/appwrite/database";

export async function loader({ request }: Route.ClientLoaderArgs) {
  return await withSessionClient(request, async (client) => {
    const places = await getPlaces();
    const allowedPlaces = await getAllowedPlaces(client, places);
    await updatePlacesCollection(places);
    return {
      places: allowedPlaces,
    };
  });
}

export function shouldRevalidate(arg: Route.shouldRevalidate) {
  return false;
}

export default function PageWrappers({ loaderData }: Route.ComponentProps) {
  const { places } = loaderData;
  return (
    <PlacesContextProvider places={places}>
      <DisplayedPlacesContextProvider places={places}>
        <MapboxContext>
          <Outlet />
          <Map />
        </MapboxContext>
      </DisplayedPlacesContextProvider>
    </PlacesContextProvider>
  );
}
