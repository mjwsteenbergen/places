import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePageState } from "./context/page-state";
import { useDebounce } from "@uidotdev/usehooks";

export type FinalReply<T> = Response<T, unknown>;
export type ResponseReply<T> = Response<undefined, T>;

export type Response<T, Y> = {
  Reply: Reply<T>;
  State?: Y;
};

export type Reply<T> = {
  Result: T;
};

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
};

export type PlaceDetails = {
  PlaceProps: Place;
  PageText: string;
  Wikipedia: WikipediaData;
  imageUrl: string;
};

export type WikipediaData = {
  text: string;
  summary: string;
  url: string;
};

export type Place = {
  latitude: number;
  longitude: number;
  name: string;
  link?: string;
  id: string;
  tags: Tag[];
  visited: boolean;
  type?: Tag;
};

export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type SearchResult = {
  Name: string;
  LocationQuery: string;
  LocationOptions: SearchCandidate[];
};

export type SearchCandidate = {
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
};

const endpoint = "https://zeus-laurentia.azurewebsites.net";

// const endpoint = "http://localhost:7071";

const getKey = () => localStorage.getItem("zeuskey");

export const getAuth = () => {
  let paramString = window.location.href.split("?")[1];
  let queryString = new URLSearchParams(paramString);
  if (queryString.has("token")) {
    localStorage.setItem("zeuskey", queryString.get("token") || "");
    queryString.delete("token");
  }

  return {
    token: getKey(),
    collectionId: queryString.get("collectionId") || undefined,
  };
};

export const getPlaces = async (): Promise<FinalReply<BasicPlace[]>> => {
  return await fetch(`${endpoint}/api/run/places`, {
    method: "POST",
    body: JSON.stringify({
      ...getAuth(),
    }),
  })
    .then((i) => i.json())
    .catch((i) => {
      console.error(i);
      const s: FinalReply<BasicPlace[]> = {
        Reply: { Result: [] },
      };

      return Promise.resolve(s);
    });
};

const getLocalPlaces = async (
  latitude: number,
  longitude: number
): Promise<FinalReply<BasicPlace[] | undefined>> => {
  return await fetch(`${endpoint}/api/run/places`, {
    method: "POST",
    body: JSON.stringify({
      ...getAuth(),
      latitude,
      longitude,
      action: "location",
    }),
  })
    .then((i) => i.json())
    .catch((i) => {
      console.error(i);
      const s: FinalReply<BasicPlace[] | undefined> = {
        Reply: {
          Result: undefined,
        },
      };

      return Promise.resolve(s);
    });
};

const getPlace = async (
  id: string
): Promise<FinalReply<PlaceDetails | undefined>> => {
  return await fetch(`${endpoint}/api/run/places`, {
    method: "POST",
    body: JSON.stringify({
      ...getAuth(),
      id,
      action: "place",
    }),
  })
    .then((i) => i.json())
    .catch((i) => {
      console.error(i);
      const s: FinalReply<PlaceDetails | undefined> = {
        Reply: {
          Result: undefined,
        },
      };

      return Promise.resolve(s);
    });
};

const search = async (query: string): Promise<BasicPlace[] | BasicPlace> => {
  return await fetch(`${endpoint}/api/run/place`, {
    method: "POST",
    body: JSON.stringify({
      ...getAuth(),
      query,
    }),
  }).then((i) =>
    i.json().then((json) => {
      const s: Response<BasicPlace, SearchResult> = json;

      if (s.Reply.Result) {
        return s.Reply.Result;
      }

      return s.State!.LocationOptions.map<BasicPlace>((i) => ({
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
    })
  );
};

export const usePlaces = () =>
  useQuery({
    queryFn: () => getPlaces().then((i) => i.Reply.Result),
    queryKey: ["places", "all"],
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

export const useSearch = (query?: string) => {
  const debouncedQuery = useDebounce(query, 500);
  return useQuery({
    enabled: !!debouncedQuery,
    queryKey: ["places", "search", debouncedQuery],
    queryFn: () => search(debouncedQuery!),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useAddPlace = (id: string) => {
  const { setSelectedPlace } = usePageState();
  const queryClient = useQueryClient();
  const s = useMutation({
    mutationFn: () => search(id),
    mutationKey: ["places", "search", "add", id],
    onSuccess: (data) => {
      if (Array.isArray(data)) {
        console.error("something went wrong");
      } else {
        setSelectedPlace(data.Id);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["places", "all"],
      });
    },
  });
  return s;
};

export const useLocalPlaces = (
  input: [lat: number, lon: number] | undefined
) => {
  return useQuery({
    queryKey: ["places", "search", input?.[0], input?.[1]],
    enabled: !!input,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    queryFn: () => {
      if (!input) {
        return;
      }
      const [lat, lon] = input;
      return getLocalPlaces(lat, lon).then((i) => i.Reply.Result);
    },
  });
};

export const useFullPlace = (id: string) => {
  const { data: places } = usePlaces();
  let place = places?.find((i) => i.Id === id);
  let placeholderData: PlaceDetails | undefined =
    place &&
    ({
      imageUrl: place.imageUrl,
      PageText: place.short,
      PlaceProps: {
        id: place.Id,
        latitude: place.Latitude,
        longitude: place.Longitude,
        name: place.Name,
        tags: place.tags.map<Tag>((i) => {
          return {
            color: "blue",
            id: i,
            name: i,
          };
        }),
        visited: false,
      },
    } as PlaceDetails);

  return useQuery({
    queryKey: ["places", "full", id],
    placeholderData,
    queryFn: () => getPlace(id).then((i) => i.Reply.Result),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
