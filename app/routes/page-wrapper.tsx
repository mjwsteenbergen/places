import { getNotionPlaces } from "~/api/notion/api";
import type { Route } from "../+types/page-wrapper";
import { Map } from "../components/page/map/map";
import { MapboxContext } from "~/context/mapbox-gl";
import { Outlet } from "react-router";
import { withSessionClient } from "~/api/appwrite/server";
import {
  DisplayedPlacesContextProvider,
  PlacesContextProvider,
} from "~/context/displayed-places";
import {
  getAllowedPlaces,
  getAppwritePlaces,
  getAppwriteCollections,
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

    const tagsDTO = getTagsDTO(notionTags, appwriteCollections);
    const placesDTO = getPlacesDTO(notionPlaces, appwritePlaces, tagsDTO);

    return {
      places: placesDTO,
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
