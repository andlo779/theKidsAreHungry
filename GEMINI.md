# theKidsAreHungry

## Project Overview

"The Kids Are Hungry" is a shared, mobile-responsive shopping list application designed for household use. It allows users to create multiple lists, add items, assign them to stores, and mark them as purchased.

The core feature of this application is **real-time synchronization**, ensuring that if two users are viewing the same list, any changes (like adding an item or checking it off) are immediately reflected on both screens without needing to refresh.

## Architecture & Tech Stack

The project uses a locally hosted client-server architecture:

- **Frontend (`frontend/`):**
  - Framework: Vue.js 3 (Composition API) built with Vite.
  - Styling: Tailwind CSS for a mobile-first design.
  - Routing/State: Vue Router & Pinia.
  - Real-time Client: `socket.io-client` for WebSockets.
- **Backend (`backend/`):**
  - Framework: Nest.js (TypeScript).
  - Real-time Server: `@nestjs/websockets` via `socket.io`.
  - Database ORM: Prisma.
- **Database:** PostgreSQL (running locally via a container).

## Directory Structure

- `frontend/`: Contains the Vue 3 application.
  - `src/views/DashboardView.vue`: Displays all available lists and allows creating new ones.
  - `src/views/ListDetailsView.vue`: The main shopping view for a specific list. Handles WebSocket connections for live updates.
- `backend/`: Contains the Nest.js application.
  - `src/lists/`, `src/items/`, `src/stores/`, `src/users/`: REST API modules for CRUD operations.
  - `src/events/`: Contains the WebSocket Gateway (`EventsGateway`) that manages real-time socket connections and list "rooms".
  - `prisma/`: Contains the database schema (`schema.prisma`) and migrations.
- `docker-compose.yml`: Configuration to run the local PostgreSQL database using a container runtime.

## Building and Running Locally

To run the application locally, you need three separate processes running: the database container, the backend server, and the frontend server.

**1. Start the Database:**
Ensure your container runtime is active, then run:

```bash
container run -d --name shopping_list_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=shopping_list -e PGDATA=/var/lib/postgresql/data/pgdata -p 5432:5432 -v pgdata:/var/lib/postgresql/data postgres:15
```

**2. Start the Backend (Nest.js):**

```bash
cd backend
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

The backend API will be available at `http://localhost:3000`.

**3. Start the Frontend (Vue 3):**

```bash
cd frontend
npm run dev
```

The application UI will be available at `http://localhost:5173`.

## Development Notes

- **Authentication:** Currently, a dummy user (`00000000-0000-0000-0000-000000000000`) is injected on backend startup to bypass full authentication flow while developing core features. All lists and items created via the UI are temporarily attached to this user.
- **WebSockets:** The real-time functionality works by having the frontend emit a `joinList` event with the List ID when `ListDetailsView.vue` is mounted. The backend `EventsGateway` places that socket in a room for that specific list. Whenever an item is created, updated, or deleted via the REST API, the backend emits `itemCreated`, `itemUpdated`, or `itemDeleted` events to that specific room, triggering reactivity in the Vue frontend.

## TODO

- Make website mobile friendly
- Add user roles
- Add admin page to manage users
- Remove ability to register on app
- Improve Design
  - Move logout button and user name to nav-bar
  - Find a theme - better colors
  - Add fav icon
- Make page mobile friendly
- Introduce refresh token with logic so that we can have short living tokens but still have a great user experience
- Should not allow the same item twice
- Add return types everywhere
