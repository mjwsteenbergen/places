import {
  FunctionComponent,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { BasicPlace, useLocalPlaces, usePlaces, useSearch } from "../endpoint";
import { usePlacesContext } from "./places";
import { OfState } from "./mapbox-gl";

const PageStateContext = createContext<PageState | undefined>(undefined);

export type PageView = "add" | "local" | undefined;

type PageState = {
  selectedPlace?: string;
  setSelectedPlace: OfState<string | undefined>[1];
  attractionFilter: OfState<string[]>[0];
  setAttractionFilter: OfState<string[]>[1];
  collectionFilter: OfState<string | undefined>[0];
  setCollectionFilter: OfState<string | undefined>[1];
  localPlaces?: [lat: number, lon: number];
  setLocalPlaces: OfState<[lat: number, lon: number] | undefined>[1];
  selectedAddPlace?: BasicPlace;
  setSelectedAddPlace: OfState<BasicPlace | undefined>[1];
  searchQuery?: string;
  setSearchQuery: OfState<string | undefined>[1];
  view: OfState<PageView>[0];
  setView: OfState<PageView>[1];
  // places: BasicPlace[];
};

export const PageStateContextProvider: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const { places: placesContextPlaces } = usePlacesContext();
  const [collectionFilter, setCollectionFilter] = useState<string | undefined>(
    undefined
  );
  const [attractionFilter, setAttractionFilter] = useState<string[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<string | undefined>(
    undefined
  );
  const [localPlaces, setLocalPlaces] = useState<
    [lat: number, lon: number] | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [selectedAddPlace, setSelectedAddPlace] = useState<
    BasicPlace | undefined
  >(undefined);
  const [view, setView] = useState<PageView>(undefined);

  const state = {
    selectedPlace,
    setSelectedPlace,
    collectionFilter,
    setCollectionFilter,
    attractionFilter,
    setAttractionFilter,
    localPlaces,
    setLocalPlaces,
    searchQuery,
    setSearchQuery,
    selectedAddPlace,
    setSelectedAddPlace,
    view,
    setView,
  };
  return (
    <PageStateContext.Provider value={state}>
      {children}
    </PageStateContext.Provider>
  );
};

export const useFilteredPlaces = () => {
  const {
    attractionFilter,
    collectionFilter,
    localPlaces,
    searchQuery,
  } = usePageState();
  const { data: places } = usePlaces();
  const { data: calcLocalPlaces } = useLocalPlaces(localPlaces);
  const { data: searchOptions } = useSearch(searchQuery);

  let filteredPlaces = (places ?? []).concat(calcLocalPlaces ?? []).concat(searchOptions ?? []);

  if (attractionFilter.length > 0) {
    filteredPlaces = filteredPlaces.filter((place) =>
      attractionFilter.includes(place.Type)
    );
  }

  if (collectionFilter !== undefined) {
    filteredPlaces = filteredPlaces.filter((i) =>
      i.tags.includes(collectionFilter)
    );
  }

  return filteredPlaces;
};

export const usePageState = () => {
  const context = useContext(PageStateContext);
  if (context) {
    return context;
  }
  throw new Error("No context set");
};
