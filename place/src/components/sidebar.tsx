import { ReactNode, useCallback, useEffect, useState } from "react";
import { Badge } from "./badge"
import { useFilteredPlaces, usePageState } from "../context/page-state"
import { BasicPlace, Place, PlaceDetails, WikipediaData, cachedApi } from "../endpoint";
import { PlaceDetailsComp } from "./placeDetails";
import { usePlacesContext } from "../context/places";
import { useMapboxMap } from "../context/mapbox-gl";
import { createLayer, createPlaces, fitAllInBounds } from "../map/createPlaces";
import { Camera, Clutery, NavArrowUp, PinAlt, QuestionMark, Suggestion } from 'iconoir-react'
import { SearchBox } from "./SearchBox";
import { GooglePlaceDetails } from "./googleResult";

export const SideBar = () => {
    const { selectedPlace } = usePageState();
    const [pageDetails, setPageDetails] = useState<PlaceDetails | undefined>(undefined);

    useEffect(() => {
        if (!selectedPlace) {
            setPageDetails(undefined);
            return;
        }
        cachedApi.getPlace(selectedPlace.Id).then(i => setPageDetails(i.Reply.Result));
    }, [selectedPlace])

    return <aside className={"w-1/5 bg-white m-5 p-4 rounded-xl pointer-events-auto flex flex-col transition-all duration-200" + (pageDetails ? "" : " translate-x-[110%]")}>
        {pageDetails && <PlaceDetailsComp place={pageDetails} close={() => setPageDetails(undefined)} />}
        {!pageDetails && <p>Find your place</p>}
    </aside>
}

type SideBar2State = "start" | "item" | "list"

export const SideBar3 = () => {
    const { places } = usePlacesContext();
    const [state, setState] = useState<SideBar2State>("start");
    const [selected, setSelected] = useState<string | undefined>(undefined)
    {/* <aside className={"w-1/5 bg-white m-5 p-4 rounded-xl pointer-events-auto  transition-all duration-200" + (pageDetails ? "" : " translate-x-[110%]")}>
        {pageDetails && <PlaceDetailsComp place={pageDetails} close={() => setPageDetails(undefined)} />}
        {!pageDetails && <p>Find your place</p>}
    </aside> */}

    switch (state) {
        case "start":
        case "item":
        case "list":
    }

    return <section className="m-5 flex rounded-lg">
        <ul className={"reset flex flex-col pointer-events-auto overflow-y-auto rounded-lg transition-all duration-200" + (selected ? " gap-0" : " gap-0")}>
            {places.map(place => {
                let selState: SelectionState = "none"
                if (selected) {
                    if (selected === place.Id) {
                        selState = "selected";
                    }
                    else {
                        selState = "other-selected"
                    }
                }

                return <SidebarItem key={place.Id} place={place} selected={selState} setSelected={() => { selected === place.Id ? setSelected(undefined) : setSelected(place.Id) }} />
            })}
        </ul>
    </section>

}


export const SideBar2 = () => {
    const { places: allPlaces } = usePlacesContext();
    const [map] = useMapboxMap();
    const [showPlaces, setShowPlaces] = useState(false);
    const { selectedPlace, filter, setFilter, setSelectedPlace, localPlaces, setLocalPlaces } = usePageState();
    const filteredSource = useFilteredPlaces();
    const resetSelectedPlace = () => {
        if (selectedPlace !== undefined) {
            setSelectedPlace(undefined);
        }
    };
    const { tags: filterTag } = filter;
    console.log("filterTag", filterTag);
    const setFilterTag = (tags: string[]) => setFilter({ ...filter, tags });
    const setFilterText = (text: string) => setFilter({ ...filter, name: text });


    let xtra = <></>;

    const toggleFilterTag = (tag: string) => {
        if (filterTag.includes(tag)) {
            setFilterTag(filterTag.filter(i => i !== tag));
        } else {
            console.log([...filterTag, tag])
            setFilterTag([...filterTag, tag])
        }
    }

    try {
        const badges = Array.from(allPlaces.flatMap(i => i.tags ?? [])
            .reduce((set, item) => {
                set.find(i => i[0] === item) ? set.find(i => i[0] === item)![1]++ : set.push([item, 1]);
                return set;
            }, [] as [string, number][]))
            .sort((a, b) => b[1] - a[1])
            .map(i => i[0])
            .map(tag => <Badge name={tag} checked={filterTag.includes(tag)} onClicked={() => toggleFilterTag(tag)} />)
        xtra = badges.length > 0 ? <ul className="reset gap-3 pointer-events-auto overflow-x-auto [&::-webkit-scrollbar]:hidden shrink-0 flex">{badges}</ul> : <></>
    } catch { }

    const rest = () => {
        if (selectedPlace) {
            return <ExpandedSideBarItem place={selectedPlace} close={resetSelectedPlace} />
        } else {
            if (showPlaces) {

                return <>
                    <ul className={"reset flex flex-col pointer-events-auto overflow-y-auto rounded-lg transition-all duration-200"}>
                        {filteredSource.map(place => <SidebarItem2 place={place} onClick={() => setSelectedPlace(place)} />)}
                    </ul>
                    {xtra}
                </>
            }
            return "";
        }
    }
    const find = () => {
        if (map) {
            const { lat, lng } = map.getCenter()
            cachedApi.getLocalPlaces(lat, lng).then(async i => {
                setLocalPlaces(i.Reply.Result);
                setFilterText("")
            })
        }

    }

    const onSearch: React.ChangeEventHandler<HTMLInputElement> = (i) => {
        setFilterText(i.target.value);
        resetSelectedPlace();
        if (!showPlaces) {
            setShowPlaces(true);
        }
    }

    return <section className="justify-end m-5 flex flex-col gap-5 overflow-hidden w-[50ch] max-w-full md:flex-col-reverse">
        {rest()}
        <SearchBox
            onChange={onSearch}
            searchForLocalPlaces={find}
            expanded={showPlaces}
            onExpandClick={() => setShowPlaces(!showPlaces)}
            showingLocalPlaces={!!localPlaces}
            resetLocalPlaces={() => {
                setLocalPlaces(undefined)
            }
            }

        />
    </section>

}

type SelectionState = "none" | "selected" | "other-selected";

type SidebarItemProps = {
    place: BasicPlace
    selected: SelectionState;
    setSelected: () => void;
}

export const SidebarItem = ({ place, selected, setSelected }: SidebarItemProps) => {
    const [placeDetails, setPlaceDetails] = useState<PlaceDetails | undefined>(undefined);

    useEffect(() => {
        if (placeDetails || selected != "selected") {
            return;
        }
        cachedApi.getPlace(place.Id).then(i => setPlaceDetails(i.Reply.Result));
    }, [placeDetails, selected])

    return <li className={"bg-white max-w-lg px-5" + (selected === 'selected' ? " rounded-lg my-5 py-5" : " mb-0 mt-0") + (selected === 'other-selected' ? "" : "")} onClick={() => setSelected()}>
        {selected === 'selected' && placeDetails ? <PlaceDetailsComp place={placeDetails} close={() => { }} /> : <h4>{place.Name}</h4>}
    </li>
}

const map: Record<BasicPlace['Type'], ReactNode> = {
    "Place to visit": <Camera />,
    "Place to eat": <Clutery />,
    "Vacation Highlight": <PinAlt />,
    "Vacation Option": <Suggestion />,
    "WikipediaPlace": <Camera />,
    "unknown": <QuestionMark />
};

const SidebarItem2 = ({ place, onClick }: SidebarItem2Props) => {
    return <li className="bg-white max-w-lg px-5 cursor-pointer" onClick={onClick}>
        <h4 className="flex gap-2 text-ellipsis">{map[place.Type] ?? map['unknown']} {place.Name}</h4>
    </li>
}

type SidebarItem2Props = {
    place: BasicPlace;
    onClick: () => void;
}

type ExpandedSideBarItemProps = {
    place: BasicPlace

    close: () => void;
}

export const ExpandedSideBarItem = ({ place, close }: ExpandedSideBarItemProps) => {
    const [placeDetails, setPlaceDetails] = useState<PlaceDetails | undefined>(undefined);

    useEffect(() => {
        place.Type !== "GoogleResultPlace" && cachedApi.getPlace(place.Id).then(i => setPlaceDetails(i.Reply.Result));
    }, [place])

    const res = () => {
        if (place.Type === "GoogleResultPlace") {
            return<GooglePlaceDetails place={place} />
        } else if (placeDetails) {
            return <PlaceDetailsComp place={placeDetails} close={close} />;
        } else {
            return <p>Loading...</p>;
        }
    }


    return <section className="pointer-events-auto rounded-lg p-4 bg-white flex flex-col max-w-xl overflow-x-auto grow">
        {res()}
    </section>
}