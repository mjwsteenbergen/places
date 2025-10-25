import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    layout("routes/page-wrapper.tsx", [
        index("routes/home.tsx"),
        route("admin", "./routes/admin.tsx"),
        route("place/:id", "./routes/place.tsx")
    ]),
    route("login", "./routes/login.tsx"),
    route("oauth", "./routes/oauth.tsx"),
] satisfies RouteConfig;
