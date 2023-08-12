import { Cancel } from "iconoir-react";
import { useState } from "react";
import { usePageState } from "../../context/page-state";
import { BasicPlace, cachedApi, debounce } from "../../endpoint";
import {
  ContentContainer,
  HeaderContainer,
  HeaderTextBox,
  SideBarContainer,
} from "./Sidebar";
import { SidebarListItem } from "./SidebarListItem";

export const AddPlaceSidebar = () => {
  const { setGoogleResults, googleResults, setSelectedPlace } =
    usePageState();

  return (
    <SideBarContainer>
      <HeaderContainer>
        <HeaderTextBox
          onChange={(e) => searchForName(e, setGoogleResults)}
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
            <SidebarListItem
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
