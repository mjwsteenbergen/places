import { createContext, useContext, type PropsWithChildren } from "react";
import type { NotionPlace } from "~/api/notion/types";

const PlacesContext = createContext<NotionPlace[] | undefined>(undefined);

export const usePlaces = () => {
    const places = useContext(PlacesContext);
    if(!places) {
        throw new Error();
    }
    return places;
}

export const PlacesContextProvider = ({ children, places}: PropsWithChildren<{places: NotionPlace[]}>) => {
    return <PlacesContext.Provider value={places}>{children}</PlacesContext.Provider>
}

const DisplayedPlacesContext = createContext<NotionPlace[] | undefined>(undefined);

export const useDisplayedPlaces = () => {
    const places = useContext(DisplayedPlacesContext);
    if(!places) {
        throw new Error();
    }
    return places;
}

export const DisplayedPlacesContextProvider = ({ children, places}: PropsWithChildren<{places: NotionPlace[]}>) => {
    return <DisplayedPlacesContext.Provider value={places}>{children}</DisplayedPlacesContext.Provider>
}