import {
  createContext,
  FunctionComponent,
  ReactNode,
  useState,
  useContext,
} from "react";
import { BasicPlace, usePlaces } from "../endpoint";

type PlaceContextType = {
  places: BasicPlace[];
  setOverridePlaces: (places: BasicPlace[]) => void;
};

const PlaceContext = createContext<PlaceContextType>({
  places: [],
  setOverridePlaces: () => {},
});

export const PlacesContext: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const { data } = usePlaces();
  const [places, setOverridePlaces] = useState<BasicPlace[] | undefined>(
    undefined
  );

  const value = {
    places: places ?? data ?? [],
    setOverridePlaces,
  };

  return (
    <PlaceContext.Provider value={value}>{children}</PlaceContext.Provider>
  );
};

export const usePlacesContext = () => {
  return useContext(PlaceContext);
};
