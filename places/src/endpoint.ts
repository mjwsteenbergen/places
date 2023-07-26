export type FinalReply<T> = Response<T, unknown>;
export type ResponseReply<T> = Response<undefined, T>;

export type Response<T, Y> = {
    Reply: Reply<T>,
    State?: Y
}

export type Reply<T> = {
    Result: T
}

export type BasicPlace = {
    Name: string;
    Type: string;
    Id: string;
    Latitude: number;
    Longitude: number;
    summary: string;
    imageUrl: string;
    short: string;
    tags: string[];
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
    tags: Tag[];
    visited: boolean;
    type?: Tag;
}

export type Tag = {
    id: string;
    name: string;
    color: string;
}

export type SearchResult = {
    Name: string;
    LocationQuery: string;
    LocationOptions: SearchCandidate[];

}

export type SearchCandidate = {
    name: string;
    formatted_address: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        }
    }
}

const endpoint = "https://zeus-laurentia.azurewebsites.net";

// const endpoint = "http://localhost:7071";

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

type cacheItem<Y> = {
    item: Y;
    added: number;
}

function cache<Y, Arg>(func: (...args: Arg[]) => Promise<Y>, waitForS: number, session: boolean = false) {
    const storage = session ? window.sessionStorage : window.localStorage;
    return async function (...args: Arg[]) {
        return new Promise<Y>((resolve, reject) => {
            const cacheName = "cache." + func.name + "." + args.join(".")
            const json = storage.getItem(cacheName);
            if (json) {
                const c = JSON.parse(json) as cacheItem<Y>;
                resolve(c.item);
                if ((Date.now() - c.added) / 1000 < waitForS) {
                    console.debug("getting from cache: " + cacheName);
                    return;
                }
            }

            func(...args).then(result => {
                storage.setItem(cacheName, JSON.stringify({
                    added: Date.now(),
                    item: result
                } as cacheItem<Y>))
                resolve(result);
            }).catch((err) => {
                if (!json) {
                    reject(err);
                }
            });
        });
    }
}

export const getPlaces = async (): Promise<FinalReply<BasicPlace[]>> => {
    return await fetch(`${endpoint}/api/run/places`, {
        method: "POST",
        body: JSON.stringify({
            ...getAuth()
        })
    }).then(i => i.json()).catch(i => {
        console.error(i);
        const s: FinalReply<BasicPlace[]> = {
            Reply: { Result: [] }
        };

        return Promise.resolve(s);
    })

    
}

const getLocalPlaces = async (latitude: number, longitude: number): Promise<FinalReply<BasicPlace[] | undefined>> => {
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
            const s: FinalReply<BasicPlace[] | undefined> = {
                Reply: {
                    Result: undefined
                }
            };

            return Promise.resolve(s);
        })
}

const getPlace = async (id: string): Promise<FinalReply<PlaceDetails | undefined>> => {
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
            const s: FinalReply<PlaceDetails | undefined> = {
                Reply: {
                    Result: undefined
                }
            };

            return Promise.resolve(s);
        })
}

const search = async (query: string): Promise<BasicPlace[] | string> => {
    return await fetch(`${endpoint}/api/run/place`, {
        method: "POST",
        body: JSON.stringify({
            ...getAuth(),
            query
        })
    }).then(i => i.json().then(json => {
        const s: Response<string, SearchResult> = json;

        if (s.Reply.Result) {
            return s.Reply.Result;
        }

        return s.State!.LocationOptions.map<BasicPlace>(i => ({
            Name: i.name,
            Id: `${i.name}, ${i.formatted_address}`,
            Latitude: i.geometry.location.lat,
            Longitude: i.geometry.location.lng,
            tags: [],
            imageUrl: "",
            short: "",
            summary: "",
            Type: "GoogleResultPlace",
        }));
    }))
    .catch(i => {
        console.error(i)
        return Promise.resolve([]);
    })

}

export const cachedApi = {
    getPlace: cache(getPlace, 0, true),
    getLocalPlaces: cache(getLocalPlaces, 60, true),
    getPlaces: cache(getPlaces, 60, true),
    search: cache(search, 60, true)
}

export function debounce(func: any, wait: number, immediate: boolean) {
    // 'private' variable for instance
    // The returned function will be able to reference this due to closure.
    // Each call to the returned function will share this common timer.
    var timeout: number | undefined;

    // Calling debounce returns a new anonymous function
    return function () {
        // reference the context and args for the setTimeout function
        // @ts-ignore
        var context = this, args = arguments;

        // Should the function be called now? If immediate is true
        //   and not already in a timeout then the answer is: Yes
        var callNow = immediate && !timeout;

        // This is the basic debounce behaviour where you can call this
        //   function several times, but it will only execute once
        //   (before or after imposing a delay).
        //   Each time the returned function is called, the timer starts over.
        clearTimeout(timeout);

        // Set the new timeout
        timeout = setTimeout(function () {

            // Inside the timeout function, clear the timeout variable
            // which will let the next execution run when in 'immediate' mode
            timeout = undefined;

            // Check if the function already ran with the immediate flag
            if (!immediate) {
                // Call the original function with apply
                // apply lets you define the 'this' object as well as the arguments
                //    (both captured before setTimeout)
                func.apply(context, args);
            }
        }, wait);

        // Immediate mode and no wait timer? Execute the function...
        if (callNow)
            func.apply(context, args);
    };
}