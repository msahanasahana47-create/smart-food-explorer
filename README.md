# Smart Food Explorer & Meal Planner

A web app for discovering and comparing food products, with search, filters, favorites and a shopping list.

A React + TypeScript product explorer built on the public [DummyJSON Products API](https://dummyjson.com/docs/products). No backend, no database.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run preview    # serve the production build
```

## Features
- Products page with search (API), category / price / rating / stock filters, sorting, Load More
- Explorer Score (app-generated, not an official rating)
- Compare up to 3 products, favorites, shopping list, recently viewed (localStorage)
- Search and filter state in the URL, dark mode, `/` focuses search

## Structure
```
src/
  components/  reusable UI (Navbar, ProductCard, FilterPanel, ...)
  context/     AppContext: favorites, shopping list, compare, recent, theme
  hooks/       usePersistentState (localStorage)
  pages/       route components
  services/    api.ts (DummyJSON calls)
  types/       product.ts
  utils/       storage.ts, foodScore.ts, format.ts
```
