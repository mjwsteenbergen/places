# Copilot Instructions for Places

## Project Overview

**Places** is a full-stack geospatial web app that syncs place data from Notion into an interactive Mapbox map with permission-based filtering via Appwrite. Core tech: React Router 7, TypeScript, Tailwind CSS, Mapbox GL, Notion API, Appwrite.

## Architecture & Data Flow

### Three-Tier Data Pipeline

1. **Notion (Source)**: Database of places with properties (Name, Latitude, Longitude, Type, Tags, Visited, Cover image, Link)
2. **Appwrite (Authority)**: Stores permission metadata; synced via `app/api/appwrite/database.ts`
3. **Frontend (Display)**: DTOs transform raw data into `PlaceDTO`/`TagDTO` for UI rendering

**Key insight**: Appwrite entries act as a permission layer—`syncPlaces()` removes places from Appwrite if they're deleted in Notion, creating a filtered subset available to authenticated users.

### Data Transformation Pattern

- **Notion API response** → `NotionPlace` (types in `app/api/notion/types.ts`)
- **Normalizer** (`app/api/notion/normalizer.ts`): Converts Notion property objects to flat values
- **DTOs** (`app/api/places/types.ts`): `PlaceDTO`/`TagDTO` (client-safe, permission-aware)
- See `app/api/places/database.ts` for `toPlaceDTO()` / `getPlacesDTO()` logic

## Critical Workflows

### Build & Dev

```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Production build
npm run typecheck  # Type validation + React Router codegen
```

### Data Sync (Admin)

- **Route**: `/admin` → `app/routes/admin.tsx`
- **Action**: Form submission triggers `syncPlaces()` + `syncCollections()`
- **Process**: Fetches Notion data, compares with Appwrite, creates/deletes records
- **Requires**: Notion token + Appwrite admin key in `.env`

### Authentication Flow

1. User hits `/login` → redirects to Authentik OAuth
2. OAuth callback → `/oauth?userId=X&secret=Y`
3. Session created, cookie set, redirects to `/`
4. Protected routes use `withSessionClient()` wrapper

## Project Conventions

### File Organization

```
app/
├── api/                     # Server-only logic
│   ├── notion/             # Notion API client + normalizers
│   ├── appwrite/           # Appwrite client + sync logic
│   └── places/             # DTO transformations
├── routes/                 # React Router pages
├── components/
│   ├── design-system/      # Reusable UI: Button, Tag, Tabs, Link
│   └── page/               # Feature components: Map, SideMenu, TagList
├── context/                # React Context: mapbox, displayed-places
└── app.css                 # Tailwind + custom theme tokens
```

### Design System Patterns

- **Button**: `asChild` prop for polymorphism (`<Button asChild><Link>...</Link></Button>`)
- **Styling**: Use custom CSS variables (e.g., `bg-primary-interactive-default`, `text-neutral-text-high`)
- **Tabs**: Radix UI wrapper in `app/components/design-system/tabs.tsx`
- Example: `app/routes/collection.tsx` uses `Tabs`, `TabTrigger`, `TabContent`

### Map Integration

- **Mapbox GL** initialized in `Map.tsx` with custom style `newnottakenname/cl8xigw5t002s14pbpejhf6ug`
- **Layers created per place type** (City, Museum, Restaurant) in `createPlaces.tsx`
- **Interactions**: Mouseenter/mouseleave popups, click navigation via `useNavigate`
- **Context**: MapboxContext stores map instance for cross-component access

### State Management

- **React Context** for shared state (avoid prop drilling)
- `PlacesContext` + `DisplayedPlacesContext` in `app/context/displayed-places.tsx`
- `MapboxContext` for map instance sharing
- No Redux; React Router loader handles initial data

### Routes & Layouts

- `app/routes/page-wrapper.tsx` is root layout—loader fetches Notion + Appwrite data
- Child routes: `home.tsx`, `place.tsx`, `collection.tsx`, `search.tsx`, `admin.tsx`
- `login.tsx` and `oauth.tsx` bypass layout (auth flow)

## Integration Points

### Notion

- **Data Source**: Data source ID `aae2ea05-080c-43cf-aa7c-51845900282b`
- **Query**: `client.dataSources.query()` in `app/api/notion/api.ts`
- **Properties**: Typed in `NotionPlace`; use `normalizer.ts` to flatten objects

### Appwrite

- **Endpoint**: `https://appwrite.thornhillcorp.uk/v1`
- **Project ID**: `68ed4e8900179a221a94`
- **Collections**:
  - `68ed67cc0003cf18c95b` = Places (synced from Notion)
  - `68fc8d17001f601bbe93` = Collections/Tags
- **Auth**: Session cookie + OAuth (Authentik provider)
- **Sync**: Run `/admin` form to sync Notion → Appwrite

### Mapbox GL

- **Token** in `map.tsx`: `pk.eyJ1IjoibmV3bm90dGFrZW5uYW1lIiwiYSI6ImNsOHhpOTQ0YzAycjAzcHAydGR2bmN5MTYifQ.aNK_O6pCnTXSkxNJ2DcdPQ`
- **Style**: Proprietary custom style with place type icons (city, rocket, restaurant, museum, etc.)
- **Interactions API**: `map.addInteraction()` for hover/click handlers

## Common Tasks

### Adding a New Place Property

1. Add column to Notion database
2. Extend `NotionPlace.Properties` type in `app/api/notion/types.ts`
3. Add case to `mapProp()` switch in `app/api/notion/normalizer.ts`
4. Extend `PlaceDTO` type in `app/api/places/types.ts`
5. Update `toPlaceDTO()` in `app/api/places/database.ts`

### Adding a UI Component

- Create in `app/components/design-system/` if reusable across routes
- Use CVA for variants; export named component (no default)
- Reference: `Button`, `Tag`, `Tabs` pattern

### Debugging Sync Issues

- Check `.env` tokens: `NOTION_TOKEN`, `APPWRITE_TOKEN`
- Run `/admin` → inspect browser console for sync logs
- Verify Appwrite collections exist and contain `notion_id` field
- Check `syncPlaces()` + `syncCollections()` logic in `app/api/appwrite/database.ts`

### Filtering Places by Type/Tag

- Use `places.filter()` in route components
- Example: `app/routes/collection.tsx` filters by tag ID
- Context provides full place list; routes filter as needed

## Key Files Reference

- `app/routes/page-wrapper.tsx` — Data loader, core layout
- `app/api/places/database.ts` — DTO transformations (understand here first!)
- `app/api/appwrite/database.ts` — Sync logic & permission filtering
- `app/components/page/map/createPlaces.tsx` — Mapbox layer creation
- `app/routes/home.tsx` — Main UI entry point
- `.env` — Tokens (keep secrets safe; use GitHub Codespaces secrets)
