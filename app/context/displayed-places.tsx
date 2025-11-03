import { createContext, useContext, type PropsWithChildren } from "react";
import type { PlaceDTO } from "~/api/places/types";

const PlacesContext = createContext<PlaceDTO[] | undefined>(undefined);

export const usePlaces = () => {
  const places = useContext(PlacesContext);
  if (!places) {
    throw new Error();
  }
  return places;
};

export const PlacesContextProvider = ({
  children,
  places,
}: PropsWithChildren<{ places: PlaceDTO[] }>) => {
  return (
    <PlacesContext.Provider value={places}>{children}</PlacesContext.Provider>
  );
};

const DisplayedPlacesContext = createContext<PlaceDTO[] | undefined>(undefined);

export const useDisplayedPlaces = () => {
  const places = useContext(DisplayedPlacesContext);
  console.log("useDisplayedPlaces", places);
  if (!places) {
    throw new Error();
  }
  return places;
};

export const DisplayedPlacesContextProvider = ({
  children,
  places,
}: PropsWithChildren<{ places: PlaceDTO[] }>) => {
  return (
    <DisplayedPlacesContext.Provider value={places}>
      {children}
    </DisplayedPlacesContext.Provider>
  );
};
