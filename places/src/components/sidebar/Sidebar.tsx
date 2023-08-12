import { PropsWithChildren } from "react";
import { cva } from "class-variance-authority";
import { DefaultSidebar } from "./DefaultSidebar";
import { PlaceDetailSidebar } from "./DetailedSidebar";
import { usePageState } from "../../context/page-state";
import { LocalPlacesView } from "./LocalPlacesSidebar";
import { AddPlaceSidebar } from "./AddPlaceSidebar";

export const SideBarContainer = ({ children }: PropsWithChildren<{}>) => {
  return (
    <section className="justify-start m-5 flex flex-col gap-5 overflow-hidden w-[50ch] max-w-full">
      {children}
    </section>
  );
};

export const SideBar = () => {
  const { selectedPlace, googleResults, localPlaces } = usePageState();
  if (selectedPlace) {
    return <PlaceDetailSidebar selectedPlace={selectedPlace} />;
  }

  if (localPlaces) {
    return <LocalPlacesView localPlaces={localPlaces} />;
  }

  if(googleResults) {
    return <AddPlaceSidebar/>
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
  "transition-all pointer-events-auto rounded-lg bg-white flex flex-col max-w-xl overflow-x-auto",
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
