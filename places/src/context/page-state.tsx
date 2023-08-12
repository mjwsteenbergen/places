import { FunctionComponent, ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { BasicPlace, cachedApi, debounce, getAuth } from "../endpoint";
import { usePlacesContext } from "./places";
import { OfState } from "./mapbox-gl";


const PageStateContext = createContext<PageState | undefined>(undefined);

export type PageView = "add" | "local" | undefined;

type PageState = {
    selectedPlace?: BasicPlace;
    setSelectedPlace: OfState<BasicPlace | undefined>[1];
    attractionFilter: OfState<string[]>[0];
    setAttractionFilter: OfState<string[]>[1];
    collectionFilter: OfState<string | undefined>[0];
    setCollectionFilter: OfState<string | undefined>[1];
    localPlaces?: BasicPlace[];
    setLocalPlaces: OfState<BasicPlace[] | undefined>[1];
    googleResults?: BasicPlace[];
    setGoogleResults: OfState<BasicPlace[] | undefined>[1];
    view: OfState<PageView>[0];
    setView: OfState<PageView>[1];
}


export const PageStateContextProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
    const [collectionFilter, setCollectionFilter] = useState<string | undefined>(undefined);
    const [attractionFilter, setAttractionFilter] = useState<string[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<BasicPlace | undefined>(undefined);
    const [localPlaces, setLocalPlaces] = useState<BasicPlace[] | undefined>(undefined);
    const [googleResults, setGoogleResults] = useState<BasicPlace[] | undefined>(undefined);
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
        googleResults,
        setGoogleResults,
        view,
        setView
    };
    return <PageStateContext.Provider value={state}>
        {children}
    </PageStateContext.Provider>
}

export const useFilteredPlaces = () => {
    const { attractionFilter, collectionFilter } = usePageState();
    const { places } = usePlacesContext();

    let filteredPlaces = places;

    if(attractionFilter.length > 0) {
        filteredPlaces = filteredPlaces.filter(place => attractionFilter.includes(place.Type))
    }

    if (collectionFilter !== undefined) {
        filteredPlaces = filteredPlaces.filter(i => i.tags.includes(collectionFilter))
    }

    return filteredPlaces;
};


export const usePageState = () => {
    const context = useContext(PageStateContext);
    if (context) {
        return context;
    }
    throw new Error("No context set");
}