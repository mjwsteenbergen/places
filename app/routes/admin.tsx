import { useDisplayedPlaces } from "~/context/displayed-places";
import {
  DataContainer,
  MenuItem,
  PlaceList,
  SideMenu,
} from "../components/page/sidemenu/sidemenu";

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
      <DataContainer className="grow min-h-10">
        <p>I am some content</p>
      </DataContainer>
      <PlaceList />
    </SideMenu>
  );
}
