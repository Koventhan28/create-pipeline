'use strict';

const SITE_NAME = 'Five Kitchen Favourites';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function layout(title, body) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/">${SITE_NAME}</a>
  </header>
  <main class="container">
${body}
  </main>
  <footer class="site-footer">
    <p>${SITE_NAME} &middot; Photos from Unsplash</p>
  </footer>
</body>
</html>`;
}

function renderHome(recipes) {
  const cards = recipes
    .map(
      (r) => `
      <a class="card" href="/recipes/${escapeHtml(r.slug)}">
        <img src="${escapeHtml(r.image)}" alt="${escapeHtml(r.title)}" loading="lazy">
        <div class="card-body">
          <h2>${escapeHtml(r.title)}</h2>
          <p>${escapeHtml(r.summary)}</p>
          <span class="meta">${escapeHtml(r.prepTime)} prep &middot; ${escapeHtml(r.cookTime)} cook</span>
        </div>
      </a>`
    )
    .join('');

  return layout(
    SITE_NAME,
    `    <section class="intro">
      <h1>Five recipes worth cooking tonight</h1>
      <p>Pick a dish to see the ingredients and step-by-step method.</p>
    </section>
    <section class="grid">${cards}
    </section>`
  );
}

function renderRecipe(recipe, { prev, next, position, total }) {
  const ingredients = recipe.ingredients.map((i) => `<li>${escapeHtml(i)}</li>`).join('\n          ');
  const steps = recipe.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('\n          ');

  const prevLink = prev
    ? `<a href="/recipes/${escapeHtml(prev.slug)}">&larr; ${escapeHtml(prev.title)}</a>`
    : '<span></span>';
  const nextLink = next
    ? `<a href="/recipes/${escapeHtml(next.slug)}">${escapeHtml(next.title)} &rarr;</a>`
    : '<span></span>';

  return layout(
    `${recipe.title} | ${SITE_NAME}`,
    `    <article class="recipe">
      <p class="crumb"><a href="/">All recipes</a> &middot; Recipe ${position} of ${total}</p>
      <h1>${escapeHtml(recipe.title)}</h1>
      <p class="summary">${escapeHtml(recipe.summary)}</p>
      <img class="hero" src="${escapeHtml(recipe.image)}" alt="${escapeHtml(recipe.title)}">
      <ul class="facts">
        <li><strong>Prep</strong>${escapeHtml(recipe.prepTime)}</li>
        <li><strong>Cook</strong>${escapeHtml(recipe.cookTime)}</li>
        <li><strong>Serves</strong>${escapeHtml(recipe.servings)}</li>
      </ul>
      <div class="columns">
        <section>
          <h2>Ingredients</h2>
          <ul class="ingredients">
          ${ingredients}
          </ul>
        </section>
        <section>
          <h2>Method</h2>
          <ol class="steps">
          ${steps}
          </ol>
        </section>
      </div>
      <nav class="pager">${prevLink}${nextLink}</nav>
    </article>`
  );
}

function renderNotFound() {
  return layout(
    `Not found | ${SITE_NAME}`,
    `    <section class="intro">
      <h1>Recipe not found</h1>
      <p><a href="/">Back to all recipes</a></p>
    </section>`
  );
}

module.exports = { renderHome, renderRecipe, renderNotFound };
