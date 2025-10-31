import { useDisplayedPlaces } from "~/context/displayed-places";
import {
  MenuItem,
  PlaceList,
  SideMenu,
} from "../components/page/sidemenu/sidemenu";
import { Button } from "~/components/design-system/button";
import { getPlaces } from "~/api/notion/api";
import { syncPlaces } from "~/appwrite/database";
import { Form } from "react-router";

export async function action() {
  const places = await getPlaces();
  await syncPlaces(places);
}

export default function Admin() {
  const places = useDisplayedPlaces();
  const listItems = places.map((i) => {
    return (
      <MenuItem>
        {i.properties.Name.title.map((i) => i.plain_text).join(" ")}
      </MenuItem>
    );
  });

  return (
    <SideMenu>
      <div>
        <Form method="post">
          <Button type="submit">Sync</Button>
        </Form>
      </div>
      <PlaceList />
    </SideMenu>
  );
}
