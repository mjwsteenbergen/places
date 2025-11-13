import { redirect, useNavigate, useNavigation } from "react-router";
import type { Route } from "./+types/collection";
import {
  BackButton,
  DataContainer,
  PlaceMenuItem,
  SideMenu,
} from "~/components/page/sidemenu/sidemenu";
import { createAdminClient, withSessionClient } from "~/api/appwrite/server";
import { useDisplayedPlaces } from "~/context/displayed-places";
import {
  TabContent,
  TabTriggerList,
  Tabs,
  TabTrigger,
} from "~/components/design-system/tabs";
import { getAppwriteCapabilities } from "~/api/appwrite/database";
import { useCallback } from "react";
import { toUserDTO } from "~/api/places/database";
import Checkbox from "~/components/design-system/checkbox";

export async function loader({ request }: Route.ClientLoaderArgs) {
  return await withSessionClient(request, async (client) => {
    const adminClient = await createAdminClient();
    const capabilities = await getAppwriteCapabilities(client);

    const getUsers = async () => {
      if (capabilities.some((capability) => capability.name === "sharing")) {
        const users = await adminClient.users.list();
        return users.users.map(toUserDTO);
      }
      return [];
    };

    return {
      users: await getUsers(),
      capabilities,
    };
  });
}

export default function Collection({
  params: { id: collectionId },
  loaderData: { capabilities, users },
}: Route.ComponentProps) {
  const places = useDisplayedPlaces();

  const collection = places
    .flatMap((i) => i.tags)
    .find((j) => j.id === collectionId);

  if (collection === undefined) {
    redirect("/");
    return null;
  }

  const placesInCollection = places.filter((i) =>
    i.tags.some((j) => j.id === collectionId)
  );

  const Table = useCallback(() => {
    if (capabilities.some((capability) => capability.name === "sharing")) {
      return (
        <Tabs defaultValue="places">
          <TabTriggerList className="px-6">
            <TabTrigger value="places">Places</TabTrigger>
            <TabTrigger value="share">Sharing</TabTrigger>
          </TabTriggerList>
          <TabContent value="places">
            <ul>
              {placesInCollection.map((i) => {
                return <PlaceMenuItem key={i.id} place={i} />;
              })}
            </ul>
          </TabContent>
          <TabContent value="share">
            {/* <code>{JSON.stringify(collection, null, 2)}</code> */}
            <ul className="w-full">
              {users.map((user) => {
                return (
                  <li
                    key={user.id}
                    className="py-3 px-6 flex text-lg items-center justify-between"
                  >
                    <span>{user.name}</span>
                    <Checkbox />
                  </li>
                );
              })}
            </ul>
          </TabContent>
        </Tabs>
      );
    } else {
      return (
        <ul>
          {placesInCollection.map((i) => {
            return <PlaceMenuItem key={i.id} place={i} />;
          })}
        </ul>
      );
    }
  }, []);

  return (
    <>
      <title>{collection.name}</title>
      <meta property="og:title" content={collection.name} />
      <SideMenu>
        <div className="flex justify-between items-center">
          <BackButton />
        </div>
        <DataContainer>
          <h1 className="px-6 py-3 text-3xl font-bold">{collection?.name}</h1>
          <Table />
        </DataContainer>
      </SideMenu>
    </>
  );
}
