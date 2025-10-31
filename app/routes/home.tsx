import type { Route } from "./+types/home";
import { PlaceList, SideMenu } from "~/components/page/sidemenu/sidemenu";
import { TagList } from "~/components/page/TagList";
import { useDisplayedPlaces } from "~/context/displayed-places";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const places = useDisplayedPlaces();

  return (
    <SideMenu>
      <TagList places={places} />
      <PlaceList />
    </SideMenu>
  );
}
