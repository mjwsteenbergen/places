import {
  ArrowLeft,
  ArrowUpRight,
  Camera,
  Cutlery,
  Minus,
  Position,
  Pin,
  City,
  Building,
  QuestionMark,
  MapPin,
} from "iconoir-react";
import { useMemo, useState, type ReactNode } from "react";
import type { PropsWithChildren } from "react";
import { href, Link, useNavigate, useNavigation } from "react-router";
import { twMerge } from "tailwind-merge";
import type { PlaceDTO, TagDTO } from "~/api/places/types";
import { Button } from "~/components/design-system/button";
import { SideMenuContextProvider, useSideMenu } from "./sidemenuContext";
import { useGeolocateControl } from "~/context/mapbox-gl";

export const Menu = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={twMerge(className)}>
      <div className="">
        <div className=""></div>
      </div>
      <div className="">{children}</div>
    </div>
  );
};

export const LocationButton = () => {
  const [geolocateControl] = useGeolocateControl();
  return (
    <Button
      className="px-3 md:hidden"
      onClick={() => {
        geolocateControl?.trigger();
      }}
    >
      <Position />
    </Button>
  );
};

export const BackButton = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();

  if (typeof window === "undefined") {
    return null;
  }

  const canGoBack = useMemo(() => {
    if ((window.history.state?.idx ?? 0) > 0) {
      return true;
    }
    return false;
  }, []);

  return (
    canGoBack && (
      <Button
        className="px-3 max-md:hidden"
        disabled={navigation.state === "loading"}
        onClick={() => {
          navigate(-1);
        }}
      >
        <ArrowLeft />
      </Button>
    )
  );
};

export const BottomContainer = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  const [, setSideMenu] = useSideMenu();
  return (
    <div className={twMerge("flex gap-1 items-center", className)}>
      <Button className="px-3 md:hidden" onClick={() => setSideMenu(false)}>
        <Minus />
      </Button>
      <BackButton />
      {children}
    </div>
  );
};

export const SideMenu = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <div className="fixed bottom-0 z-10">
        <Button className="m-2 px-3" onClick={() => setIsOpen(true)}>
          <ArrowUpRight />
        </Button>
      </div>
    );
  }
  return (
    <SideMenuContextProvider value={[isOpen, setIsOpen]}>
      <div className="fixed xl:w-lg h-[100dhv] top-0 bottom-0 right-0 p-2 lg:p-4 gap-2 xl:right-4 z-10 flex flex-col-reverse xl:flex-col max-lg:w-full max-w-screen overflow-hidden">
        {children}
      </div>
    </SideMenuContextProvider>
  );
};

export const PlaceList = ({ places }: { places: PlaceDTO[] }) => {
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
        "rounded-lg bg-neutral-default overflow-y-auto overscroll-none py-2 w-full grow",
        className
      )}
    >
      {children}
    </div>
  );
};

export const PlaceMenuItem = ({ place }: { place: PlaceDTO }) => {
  const icon = useMemo(() => {
    switch (place.type) {
      case "Place to visit":
        return <Camera />;
      case "Place to Eat":
        return <Cutlery />;
      case "Vacation Highlight":
        return <MapPin />;
      case "Experience":
        return <MapPin />;
      case "City":
        return <City />;
      case "Museum":
        return <Building />;
      case "Point of interest":
        return <Camera />;
      case "WikipediaPlace":
        return <Camera />;
      default:
        return <QuestionMark />;
    }
  }, [place.type]);

  return (
    <MenuItem>
      <span>{icon}</span>
      <Link to={href("/place/:id", { id: place.id })}>{place.name}</Link>
    </MenuItem>
  );
};

const stringToColour = (str: string) => {
  let hash = 0;
  str.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, "0");
  }
  return colour;
};

export const CollectionItem = ({ tag }: { tag: TagDTO }) => {
  return (
    <MenuItem>
      <span
        aria-hidden
        className="size-3 m-1 bg-[var(--tag-color)] self-center rounded-full"
        style={
          {
            "--tag-color": stringToColour(tag.id),
          } as any
        }
      ></span>
      <Link to={href("/collection/:id", { id: tag.id })}>{tag.name}</Link>
    </MenuItem>
  );
};

export const MenuItem = ({ children }: PropsWithChildren) => {
  return <li className="px-6 py-3 flex gap-4">{children}</li>;
};
