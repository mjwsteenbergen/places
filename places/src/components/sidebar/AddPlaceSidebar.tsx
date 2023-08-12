import { Cancel } from "iconoir-react";
import {
  ContentContainer,
  HeaderContainer,
  HeaderTextBox,
  SideBarContainer,
} from "./Sidebar";
import { usePageState } from "../../context/page-state";
import { useEffect, useState } from "react";
import { SidebarItem2 } from "../sidebar";
import { BasicPlace, cachedApi, debounce } from "../../endpoint";

export const AddPlaceSidebar = () => {
  const { setView, setGoogleResults, googleResults, setSelectedPlace } =
    usePageState();
  const [searchText, setSearchText] = useState<string | undefined>(undefined);

  return (
    <SideBarContainer>
      <HeaderContainer>
        <HeaderTextBox
          onChange={(e) => (searchForName as unknown)(e, setGoogleResults)}
        />

        <button
          className={"text-xs p-3"}
          onClick={() => {
            setGoogleResults(undefined);
          }}
        >
          <Cancel />
        </button>
      </HeaderContainer>
      <ContentContainer expanded>
        <ul className="reset grid gap-1">
          {(googleResults ?? []).map((place) => (
            <SidebarItem2
              place={place}
              onClick={() => {
                setSelectedPlace(place);
              }}
            />
          ))}
        </ul>
      </ContentContainer>
    </SideBarContainer>
  );
};

const searchForName = debounce(
  (name: string, setGoogleResults: (place: BasicPlace[]) => void) => {
    cachedApi.search(name).then((i) => {
      if (Array.isArray(i)) {
        if (i.length > 0) {
          setGoogleResults(i);
          return;
        }
      }
      setGoogleResults([]);
    });
  },
  500,
  false
);
