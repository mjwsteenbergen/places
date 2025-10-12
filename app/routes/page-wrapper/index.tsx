import { getPlaces } from "~/api/notion/api";
import type { Route } from "../+types/page-wrapper";
import { Map } from "./map/map";
import { MapboxContext } from "~/context/mapbox-gl";
import { Outlet } from "react-router";

export async function loader({
    params,
}: Route.ClientLoaderArgs) {
    return await getPlaces();
}

export default function Product({
    loaderData,
}: Route.ComponentProps) {
    const results = loaderData;
    return (
        <>
        
        
        <MapboxContext>
            <Outlet/>
            <Map filteredPlaces={results} places={results} />
        </MapboxContext>
        </>
    );
}