import {
  createContext,
  type FunctionComponent,
  useState,
  useContext,
  type ReactNode,
} from "react";

export type OfState<T> = [T, (arg: T) => void];

const PlaceContext = createContext<
  OfState<mapboxgl.Map | undefined> | undefined
>(undefined);

export const MapboxContext: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const state = useState<mapboxgl.Map | undefined>(undefined);
  return (
    <PlaceContext.Provider value={state}>{children}</PlaceContext.Provider>
  );
};

export const useMapboxMap = () => {
  const s = useContext(PlaceContext);
  if (s && s.length > 1) {
    return s;
  }

  throw new Error("a");
};

const GeoLocateContext = createContext<
  OfState<mapboxgl.GeolocateControl | undefined> | undefined
>(undefined);

export const GeoLocateContextProvider: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const state = useState<mapboxgl.GeolocateControl | undefined>(undefined);
  return (
    <GeoLocateContext.Provider value={state}>
      {children}
    </GeoLocateContext.Provider>
  );
};

export const useGeolocateControl = () => {
  const s = useContext(GeoLocateContext);
  if (s && s.length > 1) {
    return s;
  }

  throw new Error("a");
};
