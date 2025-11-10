import { redirect, useNavigate, useNavigation } from "react-router";
import type { Route } from "./+types/collection";
import {
  BackButton,
  DataContainer,
  PlaceMenuItem,
  SideMenu,
} from "~/components/page/sidemenu/sidemenu";
import { useDisplayedPlaces } from "~/context/displayed-places";
import {
  TabContent,
  TabTriggerList,
  Tabs,
  TabTrigger,
} from "~/components/design-system/tabs";
import { Button } from "~/components/design-system/button";
import { ArrowLeft } from "iconoir-react";

export default function Collection({
  params: { id: collectionId },
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
              <div className="p-6" />
            </TabContent>
          </Tabs>
        </DataContainer>
      </SideMenu>
    </>
  );
}
