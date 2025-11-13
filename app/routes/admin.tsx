import { useDisplayedPlaces } from "~/context/displayed-places";
import {
  MenuItem,
  PlaceList,
  SideMenu,
} from "../components/page/sidemenu/sidemenu";
import { Button } from "~/components/design-system/button";
import { getNotionPlaces } from "~/api/notion/api";
import { syncCollections, syncPlaces } from "~/api/appwrite/database";
import { Form } from "react-router";

export async function action() {
  const places = await getNotionPlaces();
  await syncPlaces(places);
  await syncCollections(places);
}

export default function Admin() {
  const places = useDisplayedPlaces();
  const listItems = places.map((i) => {
    return <MenuItem>{i.name}</MenuItem>;
  });

  return (
    <SideMenu>
      <div>
        <Form method="post">
          <Button type="submit">Sync</Button>
        </Form>
      </div>
    </SideMenu>
  );
}
