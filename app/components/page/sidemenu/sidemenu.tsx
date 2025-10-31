import { Menu } from "iconoir-react";
import type { ReactNode } from "react";
import type { PropsWithChildren } from "react";
import { href, Link } from "react-router";
import { twMerge } from "tailwind-merge";
import type { NotionPlace } from "~/api/notion/types";
import { useDisplayedPlaces } from "~/context/displayed-places";

export const SideMenu = ({ children }: PropsWithChildren) => {
  return (
    <div className="fixed xl:max-w-lg h-[100dhv] top-0 bottom-0 right-0 p-2 lg:p-4 gap-2 xl:mr-4 z-10 flex flex-col-reverse xl:flex-col max-lg:w-full max-w-screen overflow-hidden">
      {children}
    </div>
  );
};

export const PlaceList = () => {
  const places = useDisplayedPlaces();

  return (
    <DataContainer>
      <ul>
        {places.map((i) => {
          return <PlaceMenuItem key={i.id} place={i} />;
        })}
      </ul>
    </DataContainer>
  );
};

export const DataContainer = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div
      className={twMerge(
        "rounded-lg bg-neutral-default overflow-y-auto overscroll-none py-2 max-lg:w-full xl:min-w-lg max-w-full grow",
        className
      )}
    >
      {children}
    </div>
  );
};

export const PlaceMenuItem = ({ place }: { place: NotionPlace }) => {
  return (
    <MenuItem>
      <Link to={href("/place/:id", { id: place.id })}>
        {place.properties.Name.title.map((i) => i.plain_text).join(" ")}
      </Link>
    </MenuItem>
  );
};

export const MenuItem = ({ children }: PropsWithChildren) => {
  return <li className="px-6 py-3">{children}</li>;
};
