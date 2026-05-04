# Dota Mate - Portfolio UI Project

A modern Vue 3 frontend for exploring Dota 2 heroes, pro teams, and matchup data from OpenDota-powered APIs.

## Why This Project

This app is intentionally lightweight and focused on frontend craftsmanship:
- polished UI layout and visual hierarchy
- responsive card-based exploration
- smooth interactions and loading states
- clean, maintainable Vue component structure

## Features

- Hero explorer with paginated results
- Pro team explorer with ratings and records
- Detail pages with matchup breakdowns
- Responsive layout optimized for mobile and desktop
- Skeleton loading states and fallback image support

## Tech Stack

- [Vue 3](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Axios](https://axios-http.com/)
- [vue-awesome-paginate](https://www.npmjs.com/package/vue-awesome-paginate)

## Getting Started

1. Clone:
   `git clone https://github.com/johnmichealacera/dota2-vue-app.git`
2. Install dependencies:
   `npm install`
3. Create `.env` at project root:
   `VUE_APP_DOTA_BACKEND_API=http://localhost:8000`
4. Run locally:
   `npm run serve`

Then open `http://localhost:8080/`.

## Environment Variable

- `VUE_APP_DOTA_BACKEND_API`: Base URL of the backend API.

## Backend

The current backend lives in your separate project and is consumed through REST endpoints. This frontend is kept decoupled so backend implementation can evolve independently (Node.js now, Rust later if you decide to migrate).

## License

MIT