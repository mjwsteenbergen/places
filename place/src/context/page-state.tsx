import { FunctionComponent, ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { BasicPlace, cachedApi, debounce, getAuth } from "../endpoint";
import { usePlacesContext } from "./places";
import { OfState } from "./mapbox-gl";


const PageStateContext = createContext<PageState | undefined>(undefined);

type PlaceFilter = {
    name: string;
    tags: string[];
}

type PageState = {
    selectedPlace?: BasicPlace;
    setSelectedPlace: OfState<BasicPlace | undefined>[1];
    filter: OfState<PlaceFilter>[0];
    setFilter: OfState<PlaceFilter>[1];
    localPlaces?: BasicPlace[];
    setLocalPlaces: OfState<BasicPlace[] | undefined>[1];
    googleResults?: BasicPlace[];
    setGoogleResults: OfState<BasicPlace[] | undefined>[1];
}


export const PageStateContextProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
    const [filter, setFilter] = useState<PlaceFilter>({
        name: "",
        tags: ["Personal"]
    });
    const [selectedPlace, setSelectedPlace] = useState<BasicPlace | undefined>(undefined);
    const [localPlaces, setLocalPlaces] = useState<BasicPlace[] | undefined>(undefined);
    const [googleResults, setGoogleResults] = useState<BasicPlace[] | undefined>(undefined);
    const state = {
        selectedPlace,
        setSelectedPlace,
        filter,
        setFilter,
        localPlaces,
        setLocalPlaces,
        googleResults,
        setGoogleResults
    };
    return <PageStateContext.Provider value={state}>
        {children}
    </PageStateContext.Provider>
}

const searchForName = debounce((name: string, setGoogleResults: (place:BasicPlace[] | undefined) => void) => {
    cachedApi.search(name).then(i => {
        if (Array.isArray(i)) {
            if (i.length > 0) {
                setGoogleResults(i)
                return
            }
        }
        setGoogleResults(undefined)
    });
}, 500, false)

export const useFilteredPlaces = () => {
    const { localPlaces, googleResults, setGoogleResults, filter: { name, tags } } = usePageState();
    const { places } = usePlacesContext();

    const textFilteredSource = (places ?? [])
        .filter(i => name === "" || i.Name.toLowerCase().includes(name.toLowerCase()));
    const tagFiltered = textFilteredSource.filter(i => tags.length === 0 || i.tags.some(tag => tags.includes(tag)));

    useEffect(() => {
        if (name !== "" && tagFiltered.length === 0 && getAuth().token && !localPlaces) {
            //@ts-ignore
            searchForName(name, setGoogleResults);
        } else {
            setGoogleResults(undefined);
        }
    }, [name]);
    return localPlaces ?? googleResults ?? tagFiltered;
};


export const usePageState = () => {
    const context = useContext(PageStateContext);
    if (context) {
        return context;
    }
    throw new Error("No context set");
}