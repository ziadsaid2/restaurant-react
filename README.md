# Restaurant — Web Client

React front end for the restaurant management system: browsing the menu, placing orders, booking a table, and an admin area for staff.

## Stack

React · Vite · Context API for auth and session state

## Structure

- `pages` — routed screens
- `components` — shared UI
- `context` — auth and global state
- `api` — HTTP layer talking to the NestJS backend
- `utils` — helpers

## Running locally

```bash
npm install
npm run dev
```

Expects the API from [restaurant-api](https://github.com/ziadsaid2/restaurant-api) to be running.
