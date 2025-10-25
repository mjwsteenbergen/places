import type { ReactNode } from "react";
import type { PropsWithChildren } from "react";
import { href, Link } from "react-router";
import { twMerge } from "tailwind-merge";
import { useDisplayedPlaces } from "~/context/displayed-places";

export const SideMenu = ({ children }: PropsWithChildren) => {
  return (
    <div className="fixed h-screen right-0 p-2 lg:p-4 flex flex-col gap-2 xl:mr-4 z-10">
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
          return (
            <MenuItem>
              <Link to={href("/place/:id", { id: i.id })}>
                {i.properties.Name.title.map((i) => i.plain_text).join(" ")}
              </Link>
            </MenuItem>
          );
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
        "rounded-lg bg-neutral-default overflow-y-auto overscroll-none py-2 xl:min-w-lg",
        className
      )}
    >
      {children}
    </div>
  );
};

export const MenuItem = ({ children }: PropsWithChildren) => {
  return <li className="px-6 py-3">{children}</li>;
};
