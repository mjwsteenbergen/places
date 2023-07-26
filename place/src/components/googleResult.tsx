import { Cancel } from "iconoir-react";
import { usePageState } from "../context/page-state";
import { BasicPlace, cachedApi, getAuth, getPlaces } from "../endpoint";
import { Badge } from "./badge";
import { usePlacesContext } from "../context/places";

type GooglePlaceDetailsProps = {
    place: BasicPlace;
}



export const GooglePlaceDetails = ({ place }: GooglePlaceDetailsProps) => {
    const { setSelectedPlace, setGoogleResults } = usePageState();
    const { setPlaces } = usePlacesContext();

    const add = (place: BasicPlace) => {
        cachedApi.search(place.Id).then(i => {
            if (Array.isArray(i)) {
                setSelectedPlace(undefined);
            } else {
                setTimeout(() => {
                    getPlaces().then(places => {
                        const newPlace = places.Reply.Result.find(i => i.Name === place.Name);
                        setPlaces(places.Reply.Result);
                        if (newPlace) {
                            console.log("found place", newPlace);
                            setSelectedPlace(newPlace);
                        } else {
                            console.log("could not find place");
                            setSelectedPlace(undefined);
                        }
                    });
                }, 1000);
            }
            setGoogleResults(undefined);


        });
    }

    return <><div className="overflow-y-auto overflow-x-hidden">
        <div className="flex flex-shrink self-stretch justify-between max-w-full">
            <ul className="reset flex-shrink flex align-middle flex-wrap gap-2">
                {place.Type && <Badge name={place.Type} />}
                {/* {PlaceProps.visited && <Badge name={"Have been"} />} */}
                {place.tags?.map(tag => <Badge key={tag} name={tag} />)}
                {/* {PlaceProps.link ? <Badge href={PlaceProps.link} name={"View link ↗"} /> : ""} */}
                <Badge href={"https://www.google.com/maps/search/" + place.Latitude + "," + place.Longitude} name={"Directions ↗"} />
            </ul>
            <button className="self-end" onClick={() => setSelectedPlace(undefined)}><Cancel /></button>
        </div>
        <h1>{place.Name}</h1>
        <p>Some content should go here, but Google an asshole</p>
    </div>
        <div className="flex-grow"></div>
        {place.Name && getAuth().token && <button className="self-stretch text-center" onClick={() => add(place)}>Add to Notion</button>}
    </>
}