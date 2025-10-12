import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    layout("routes/page-wrapper/index.tsx", [
        index("routes/home.tsx"),
    ]),
    route("login", "./routes/login.tsx"),
] satisfies RouteConfig;
