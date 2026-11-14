# Recipe Site

A simple five-recipe website. The home page lists all five recipes, and each recipe has its own page with a photo, ingredients and method.

Built with **Node.js + Express**. One process serves the HTML pages, CSS and images. There is no database and no external services, and the photos are bundled in the repo, so it runs in a single container with no network access needed at runtime.

## Pages

| Route | Description |
|---|---|
| `/` | Home page listing all 5 recipes |
| `/recipes/bbq-chicken-pizza` | BBQ Chicken Pizza |
| `/recipes/banana-pancakes` | Fluffy Banana Pancakes |
| `/recipes/classic-cheeseburger` | Double Cheeseburger |
| `/recipes/paneer-butter-masala` | Paneer Butter Masala |
| `/recipes/penne-bolognese` | Penne Bolognese |
| `/health` | Health check, returns `{"status":"ok","recipes":5}` |

## Run locally

```bash
npm install
npm start
# open http://localhost:3000
```

## Notes for containerization

| Item | Value |
|---|---|
| Runtime | Node.js 18 or newer |
| Install deps | `npm ci --omit=dev` (a `package-lock.json` is committed) |
| Start command | `node server.js` (or `npm start`) |
| Port | `3000` by default, override with the `PORT` env var |
| Bind address | `0.0.0.0` by default, override with the `HOST` env var |
| Health check | `GET /health` returns HTTP 200 |
| Shutdown | Handles `SIGTERM`/`SIGINT` and exits cleanly |
| Files needed at runtime | `server.js`, `views.js`, `data/`, `public/`, `package*.json`, `node_modules/` |
| Exclude from build context | `node_modules/` (install inside the image) |
| Writes to disk | None, so a read-only filesystem and a non-root user both work |

## Project structure

```
recipe-site/
├── server.js            # Express app: routes, static files, health check
├── views.js             # HTML templates
├── data/recipes.json    # The five recipes (edit here to change content)
└── public/
    ├── css/style.css
    └── images/          # One photo per recipe
```

Photos are from [Unsplash](https://unsplash.com) (Unsplash License).
