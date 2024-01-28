import { Cancel } from "iconoir-react";
import { useState } from "react";
import { usePageState } from "../../context/page-state";
import { BasicPlace, useSearch } from "../../endpoint";
import {
  ContentContainer,
  HeaderContainer,
  HeaderTextBox,
  SideBarContainer,
} from "./Sidebar";
import { SidebarListItem } from "./SidebarListItem";

export const AddPlaceSidebar = () => {
  const { setSearchQuery, searchQuery, setSelectedAddPlace } = usePageState();
  const { data } = useSearch(searchQuery);

  return (
    <SideBarContainer>
      <HeaderContainer>
        <HeaderTextBox onChange={(e) => setSearchQuery(e)} />

        <button
          className={"text-xs p-3"}
          onClick={() => {
            setSearchQuery(undefined);
          }}
        >
          <Cancel />
        </button>
      </HeaderContainer>
      <ContentContainer expanded>
        <ul className="reset grid gap-1">
          {data &&
            Array.isArray(data) &&
            data.map((place) => (
              <SidebarListItem
                place={place}
                onClick={() => {
                  setSelectedAddPlace(place);
                }}
              />
            ))}
        </ul>
      </ContentContainer>
    </SideBarContainer>
  );
};
