import {
  createContext,
  FunctionComponent,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";
import { BasicPlace, cachedApi } from "../endpoint";

type PlaceContextType = {
  places: BasicPlace[];
  setPlaces: (places: BasicPlace[]) => void;
};

const PlaceContext = createContext<PlaceContextType>({
  places: [],
  setPlaces: () => {},
});

export const PlacesContext: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const [places, setPlaces] = useState<BasicPlace[]>([]);
  useEffect(() => {
    cachedApi.getPlaces().then((i) => setPlaces(i.Reply.Result));
  }, []);

  const value = {
    places,
    setPlaces,
  };

  return (
    <PlaceContext.Provider value={value}>{children}</PlaceContext.Provider>
  );
};

export const usePlacesContext = () => {
  return useContext(PlaceContext);
};
