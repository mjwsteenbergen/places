import { PropsWithChildren } from "react";
import { cva } from "class-variance-authority";
import { DefaultSidebar } from "./DefaultSidebar";
import { PlaceDetailSidebar } from "./DetailedSidebar";
import { useFilteredPlaces, usePageState } from "../../context/page-state";
import { LocalPlacesView } from "./LocalPlacesSidebar";
import { AddPlaceSidebar } from "./AddPlaceSidebar";
import { SelectedAddPlaceSidebar } from "./SelectedAddPlaceSidebar";
import { useLocalPlaces, usePlaces } from "../../endpoint";

export const SideBarContainer = ({ children }: PropsWithChildren<{}>) => {
  return (
    <section className="max-md:flex-col-reverse justify-start m-5 flex flex-col gap-5 overflow-hidden w-[50ch] max-w-full">
      {children}
    </section>
  );
};

export const SideBar = () => {
  const { selectedPlace, searchQuery, localPlaces, selectedAddPlace } =
    usePageState();
  const data = useFilteredPlaces();
  const { data: calcLocalPlaces } = useLocalPlaces(localPlaces);

  const calcSelectedPlace = data && data.find((i) => i.Id === selectedPlace);

  if (calcSelectedPlace) {
    return <PlaceDetailSidebar selectedPlace={calcSelectedPlace} />;
  }

  if (selectedAddPlace) {
    return <SelectedAddPlaceSidebar selectedPlace={selectedAddPlace} />;
  }

  if (calcLocalPlaces) {
    return <LocalPlacesView localPlaces={calcLocalPlaces} />;
  }

  if (searchQuery !== undefined) {
    return <AddPlaceSidebar />;
  }

  return <DefaultSidebar />;
};

export const HeaderContainer = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div
      className={
        "pointer-events-auto rounded-lg flex items-center gap-2 " + className
      }
    >
      {children}
    </div>
  );
};

type HProps = {
  onChange?: (text: string) => void;
};

export const HeaderTextBox = ({ onChange }: HProps) => {
  return (
    <div className="bg-white grow h-full rounded-xl grid justify-stretch items-center px-2 py-2">
      <input
        type="text"
        onChange={(e) => onChange && onChange(e.target.value)}
        className="grow w-43"
        placeholder="Which place?"
      />
    </div>
  );
};

const contentVariant = cva(
  "transition-all pointer-events-auto rounded-lg bg-white dark:bg-black-900 flex flex-col max-w-xl overflow-x-auto ",
  {
    variants: {
      expanded: {
        true: "max-h-full p-4",
        false: "max-h-0 p-0",
      },
    },
  }
);

export const ContentContainer = ({
  children,
  expanded,
}: PropsWithChildren<{ expanded: boolean }>) => {
  return <section className={contentVariant({ expanded })}>{children}</section>;
};
