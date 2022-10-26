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
    Wikipedia: WikipediaData;
    imageUrl: string;
}

export type WikipediaData = {
    text: string;
    summary: string;
    url: string;
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



const getKey = () => localStorage.getItem("zeuskey");

export const getAuth = () => {
    let paramString = window.location.href.split('?')[1];
    let queryString = new URLSearchParams(paramString);
    if (queryString.has("token")) {
        localStorage.setItem("zeuskey", queryString.get("token") || "");
        queryString.delete("token")
    }

    return {
        token: getKey(),
        collectionId: queryString.get("collectionId") || undefined
    }
}

export const getPlaces = async (): Promise<Response<PlaceOverview[]>> => {
    return await fetch(`${endpoint}/api/run/places`, {
        method: "POST",
        body: JSON.stringify({
            ...getAuth()
        })
    }).then(i => i.json()).catch(i => {
        console.log(i);
        const s: Response<PlaceOverview[]> = {
            Reply: { Result: [] }
        };

        return Promise.resolve(s);
    })

    
}

export const getLocalPlaces = async (latitude: number, longitude: number): Promise<Response<PlaceDetails[] | undefined>> => {
    return await fetch(`${endpoint}/api/run/places`, {
        method: "POST",
        body: JSON.stringify({
            ...getAuth(),
            latitude,
            longitude,
            action: "location"
        })
    }).then(i => i.json())
        .catch(i => {
            console.error(i)
            const s: Response<PlaceDetails[] | undefined> = {
                Reply: {
                    Result: undefined
                }
            };

            return Promise.resolve(s);
        })
}

export const getPlace = async (id: string): Promise<Response<PlaceDetails | undefined>> => {
    return await fetch(`${endpoint}/api/run/places`, {
        method: "POST",
        body: JSON.stringify({
            ...getAuth(),
            id,
            action: "place"
        })
    }).then(i => i.json())
        .catch(i => {
            console.error(i)
            const s: Response<PlaceDetails | undefined> = {
                Reply: {
                    Result: undefined
                }
            };

            return Promise.resolve(s);
        })
}

    