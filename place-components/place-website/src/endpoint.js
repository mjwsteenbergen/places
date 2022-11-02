const endpoint = "https://zeus-laurentia.azurewebsites.net";
/* const endpoint = "http://localhost:7071"; */
const getKey = () => localStorage.getItem("zeuskey");
export const getAuth = () => {
  let paramString = window.location.href.split('?')[1];
  let queryString = new URLSearchParams(paramString);
  if (queryString.has("token")) {
    localStorage.setItem("zeuskey", queryString.get("token") || "");
    queryString.delete("token");
  }
  return {
    token: getKey(),
    collectionId: queryString.get("collectionId") || undefined
  };
};
export const getPlaces = async () => {
  return await fetch(`${endpoint}/api/run/places`, {
    method: "POST",
    body: JSON.stringify(Object.assign({}, getAuth()))
  }).then(i => i.json()).catch(i => {
    console.log(i);
    const s = {
      Reply: { Result: [] }
    };
    return Promise.resolve(s);
  });
};
export const getLocalPlaces = async (latitude, longitude) => {
  return await fetch(`${endpoint}/api/run/places`, {
    method: "POST",
    body: JSON.stringify(Object.assign(Object.assign({}, getAuth()), { latitude,
      longitude, action: "location" }))
  }).then(i => i.json())
    .catch(i => {
    console.error(i);
    const s = {
      Reply: {
        Result: undefined
      }
    };
    return Promise.resolve(s);
  });
};
export const getPlace = async (id) => {
  return await fetch(`${endpoint}/api/run/places`, {
    method: "POST",
    body: JSON.stringify(Object.assign(Object.assign({}, getAuth()), { id, action: "place" }))
  }).then(i => i.json())
    .catch(i => {
    console.error(i);
    const s = {
      Reply: {
        Result: undefined
      }
    };
    return Promise.resolve(s);
  });
};
