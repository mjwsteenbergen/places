import { getNotionPlaces } from "~/api/notion/api";
import type { Route } from "../+types/page-wrapper";
import { Map } from "../components/page/map/map";
import { MapboxContext, GeoLocateContextProvider } from "~/context/mapbox-gl";
import { Outlet } from "react-router";
import { withSessionClient } from "~/api/appwrite/server";
import {
  DisplayedPlacesContextProvider,
  PlacesContextProvider,
} from "~/context/displayed-places";
import {
  getAppwritePlaces,
  getAppwriteCollections,
  getAppwriteCapabilities,
} from "~/api/appwrite/database";
import { getPlacesDTO, getTagsDTO } from "~/api/places/database";

export async function loader({ request }: Route.ClientLoaderArgs) {
  return await withSessionClient(request, async (client) => {
    const notionPlaces = await getNotionPlaces();
    const appwritePlaces = await getAppwritePlaces(client);
    const notionTags = notionPlaces
      .flatMap((i) => i.properties.Tags.multi_select)
      .filter((tag, index, array) => {
        return array.findIndex((t) => t.id === tag.id) === index;
      });
    const appwriteCollections = await getAppwriteCollections(client);
    const appwriteCapabilities = await getAppwriteCapabilities(client);

    const tagsDTO = getTagsDTO(
      appwriteCapabilities,
      notionTags,
      appwriteCollections
    );
    const placesDTO = getPlacesDTO(
      appwriteCapabilities,
      notionPlaces,
      appwritePlaces,
      tagsDTO
    );

    return {
      places: placesDTO,
    };
  });
}

export function shouldRevalidate() {
  return false;
}

export default function PageWrappers({ loaderData }: Route.ComponentProps) {
  const { places } = loaderData;
  return (
    <PlacesContextProvider places={places}>
      <DisplayedPlacesContextProvider places={places}>
        <GeoLocateContextProvider>
          <MapboxContext>
            <div className="h-screen overflow-visible overscroll-none w-screen">
              <Outlet />
              <Map />
            </div>
          </MapboxContext>
        </GeoLocateContextProvider>
      </DisplayedPlacesContextProvider>
    </PlacesContextProvider>
  );
}
