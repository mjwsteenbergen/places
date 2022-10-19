export type Response<T> = {
    Reply: Reply<T>
}

export type Reply<T> = {
    Result: T
}

export type PlaceOverview = {
    Name: string;
    Type: string;
    Id: string;
    Latitude: number;
    Longitude: number;
}

export type PlaceDetails = {
    PlaceProps: Place,
    PageText: string;
    Wikipedia: string;
}

export type Place = {
    latitude: number;
    longitude: number;
    name: string;
    link?: string;
    id: string;
    type?: Tag;
}

export type Tag = {
    id: string;
    name: string;
    color: string;
}

// const endpoint = "https://zeus-laurentia.azurewebsites.net";
const endpoint = "http://localhost:7071";

const getKey = (): [boolean, string] => {
    const key = localStorage.getItem("zeuskey");
    if (key) {
        return [true, key];
    } else {
        console.warn("no api key found. not doing calls");
        return [false, ""];
    }
}

export const getPlaces = async (): Promise<Response<PlaceOverview[]>> => {
    const [hasKey, key] = getKey();

    if (hasKey) {
        return await fetch(`${endpoint}/api/run/places?token=${key}`).then(i => i.json())
    }

    const s: Response<PlaceOverview[]> = {
        Reply: { Result: [] }
    };

    return Promise.resolve(s);
}

export const getPlace = async (id: string): Promise<Response<PlaceDetails | undefined>> => {
    const [hasKey, key] = getKey();

    if (hasKey) {
        return await fetch(`${endpoint}/api/run/places?token=${key}`, {
            method: "POST",
            body: JSON.stringify({ Id: id })
        }).then(i => i.json())
    }

    const s: Response<PlaceDetails | undefined> = {
        Reply: {
            Result: undefined
        }
    };

    return Promise.resolve(s);
}