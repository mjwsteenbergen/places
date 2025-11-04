import { Button } from "~/components/design-system/button";
import type { Route } from "./+types/home";
import {
  BottomContainer,
  PlaceList,
  SideMenu,
} from "~/components/page/sidemenu/sidemenu";
import { TagList } from "~/components/page/TagList";
import { useDisplayedPlaces } from "~/context/displayed-places";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Place" },
    { name: "description", content: "Your place to look at places" },
  ];
}

export default function Home() {
  const places = useDisplayedPlaces();

  return (
    <SideMenu>
      <BottomContainer>
        <TagList places={places} className="-ml-1" />
      </BottomContainer>
      <PlaceList />
    </SideMenu>
  );
}
