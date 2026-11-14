'use strict';

const path = require('path');
const express = require('express');
const recipes = require('./data/recipes.json');
const { renderHome, renderRecipe, renderNotFound } = require('./views');

// All runtime configuration comes from environment variables so the
// same build can run anywhere (local, container, any orchestrator).
const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();
app.disable('x-powered-by');

app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

app.get('/', (req, res) => {
  res.send(renderHome(recipes));
});

app.get('/recipes/:slug', (req, res) => {
  const index = recipes.findIndex((r) => r.slug === req.params.slug);
  if (index === -1) {
    return res.status(404).send(renderNotFound());
  }
  const prev = recipes[index - 1] || null;
  const next = recipes[index + 1] || null;
  res.send(renderRecipe(recipes[index], { prev, next, position: index + 1, total: recipes.length }));
});

// Lightweight endpoint for container health checks / readiness probes.
app.get('/health', (req, res) => {
  res.json({ status: 'ok', recipes: recipes.length });
});

app.use((req, res) => {
  res.status(404).send(renderNotFound());
});

const server = app.listen(PORT, HOST, () => {
  console.log(`Recipe site listening on http://${HOST}:${PORT}`);
});

// Shut down cleanly when the container runtime sends SIGTERM/SIGINT.
function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
