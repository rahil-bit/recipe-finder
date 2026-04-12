const allRecipes = [];
const favoriteIds = [];  
let showingFavoritesOnly = false;

const recipeGrid = document.getElementById("recipeGrid");
const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");
const searchClearBtn = document.getElementById("clearSearch");
const cuisineDropdown = document.getElementById("cuisineFilter");
const difficultyDropdown = document.getElementById("difficultyFilter");
const favoritesToggleBtn = document.getElementById("favoritesToggle");
const favoritesCount = document.getElementById("favoritesCount");

function isFavorite(recipeId) {
  return favoriteIds.includes(recipeId);
}

function toggleFavorite(recipeId, event) {
  event.stopPropagation();

  if (isFavorite(recipeId)) {
    const index = favoriteIds.indexOf(recipeId);
    favoriteIds.splice(index, 1);
  } else {
    favoriteIds.push(recipeId);
  }

  updateFavoritesCount();

  if (showingFavoritesOnly) {
    filterAndDisplayRecipes();
    return;
  }

  const heartBtn = document.querySelector(`.fav-btn[data-id="${recipeId}"]`);
  if (heartBtn) {
    heartBtn.classList.toggle("active", isFavorite(recipeId));
    heartBtn.title = isFavorite(recipeId) ? "Remove from favorites" : "Add to favorites";
    heartBtn.setAttribute("aria-label", isFavorite(recipeId) ? "Remove from favorites" : "Add to favorites");
  }
}

function updateFavoritesCount() {
  const count = favoriteIds.length;
  favoritesCount.textContent = count > 0 ? count : "";
  favoritesCount.classList.toggle("visible", count > 0);
}


function startApp() {
  setupEventListeners();
  downloadRecipes();
}

async function downloadRecipes() {
  showState("loading");

  try {
    const response = await fetch("https://dummyjson.com/recipes?limit=0");
    const data = await response.json();

    for (let i = 0; i < data.recipes.length; i++) {
      allRecipes.push(data.recipes[i]);
    }

    populateCuisineDropdown();
    filterAndDisplayRecipes();

  } catch (error) {
    console.error(error);
    showState("error");
  }
}

function filterAndDisplayRecipes() {
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedCuisine = cuisineDropdown.value;
  const selectedDifficulty = difficultyDropdown.value;

  const matchingRecipes = [];

  for (let i = 0; i < allRecipes.length; i++) {
    const recipe = allRecipes[i];

    if (showingFavoritesOnly && !isFavorite(recipe.id)) {
      continue;
    }

    let matchesSearch = true;
    if (searchText !== "") {
      if (recipe.name.toLowerCase().includes(searchText) === false) {
        matchesSearch = false;
      }
    }

    let matchesCuisine = true;
    if (selectedCuisine !== "") {
      if (recipe.cuisine !== selectedCuisine) {
        matchesCuisine = false;
      }
    }

    let matchesDifficulty = true;
    if (selectedDifficulty !== "") {
      if (recipe.difficulty !== selectedDifficulty) {
        matchesDifficulty = false;
      }
    }

    if (matchesSearch && matchesCuisine && matchesDifficulty) {
      matchingRecipes.push(recipe);
    }
  }

  document.getElementById("resultsCount").innerText = matchingRecipes.length + " recipes";

  displayGrid(matchingRecipes);
}

function displayGrid(recipesToDisplay) {
  if (recipesToDisplay.length === 0) {
    if (showingFavoritesOnly) {
      showState("emptyFavorites");
    } else {
      showState("empty");
    }
    return;
  }

  showState("grid");
  recipeGrid.innerHTML = "";

  for (let i = 0; i < recipesToDisplay.length; i++) {
    const recipe = recipesToDisplay[i];
    const prepTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
    const favorited = isFavorite(recipe.id);

    const cardHTML = `
      <article class="recipe-card" onclick="openRecipeModal(${recipe.id})">
        <div class="card-image-wrap">
          <img src="${recipe.image}" alt="${recipe.name}">
          <span class="card-badge">${recipe.cuisine}</span>
          <button
            class="fav-btn ${favorited ? "active" : ""}"
            data-id="${recipe.id}"
            onclick="toggleFavorite(${recipe.id}, event)"
            title="${favorited ? "Remove from favorites" : "Add to favorites"}"
            aria-label="${favorited ? "Remove from favorites" : "Add to favorites"}"
          >&#9829;</button>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span>⭐ ${recipe.rating}</span>
            <span>${recipe.difficulty}</span>
          </div>
          <h2 class="card-title">${recipe.name}</h2>
        </div>
        <div class="card-footer">
          <span>🕒 ${prepTime} min total</span>
        </div>
      </article>
    `;

    recipeGrid.innerHTML += cardHTML;
  }
}


function openRecipeModal(recipeId) {
  let recipeInfo = null;
  for (let i = 0; i < allRecipes.length; i++) {
    if (allRecipes[i].id === recipeId) {
      recipeInfo = allRecipes[i];
      break;
    }
  }

  if (recipeInfo === null) return;

  let ingredientsHTML = "";
  for (let i = 0; i < recipeInfo.ingredients.length; i++) {
    ingredientsHTML += "<li>" + recipeInfo.ingredients[i] + "</li>";
  }

  let instructionsHTML = "";
  for (let i = 0; i < recipeInfo.instructions.length; i++) {
    instructionsHTML += "<li>" + recipeInfo.instructions[i] + "</li>";
  }

  const favorited = isFavorite(recipeInfo.id);

  document.getElementById("modalBody").innerHTML = `
    <img class="modal-hero-img" src="${recipeInfo.image}" alt="${recipeInfo.name}">
    <div class="modal-info">
      <div class="modal-title-row">
        <h2 class="modal-title">${recipeInfo.name}</h2>
        <button
          class="modal-fav-btn ${favorited ? "active" : ""}"
          id="modalFavBtn"
          onclick="toggleFavoriteFromModal(${recipeInfo.id})"
          title="${favorited ? "Remove from favorites" : "Add to favorites"}"
        >
          ${favorited ? "♥ Saved" : "♡ Save Recipe"}
        </button>
      </div>
      <div class="modal-stats">
        <span>⭐ ${recipeInfo.rating}</span>
        <span>🕒 Prep: ${recipeInfo.prepTimeMinutes}m</span>
        <span>🍳 Cook: ${recipeInfo.cookTimeMinutes}m</span>
        <span>🔥 ${recipeInfo.caloriesPerServing} cal</span>
      </div>
    </div>
    <div class="modal-section">
      <h3>Ingredients</h3>
      <ul class="ingredients-list">${ingredientsHTML}</ul>
    </div>
    <div class="modal-section">
      <h3>Instructions</h3>
      <ol class="instructions-list">${instructionsHTML}</ol>
    </div>
  `;

  document.getElementById("modalOverlay").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function toggleFavoriteFromModal(recipeId) {
  if (isFavorite(recipeId)) {
    const index = favoriteIds.indexOf(recipeId);
    favoriteIds.splice(index, 1);
  } else {
    favoriteIds.push(recipeId);
  }
  updateFavoritesCount();
  const modalFavBtn = document.getElementById("modalFavBtn");
  if (modalFavBtn) {
    const nowFavorited = isFavorite(recipeId);
    modalFavBtn.classList.toggle("active", nowFavorited);
    modalFavBtn.title = nowFavorited ? "Remove from favorites" : "Add to favorites";
    modalFavBtn.innerHTML = nowFavorited ? "♥ Saved" : "♡ Save Recipe";
  }
  const heartBtn = document.querySelector(`.fav-btn[data-id="${recipeId}"]`);
  if (heartBtn) {
    heartBtn.classList.toggle("active", isFavorite(recipeId));
  }
}

document.getElementById("modalClose").addEventListener("click", function () {
  document.getElementById("modalOverlay").classList.add("hidden");
  document.body.style.overflow = "";
  if (showingFavoritesOnly) {
    filterAndDisplayRecipes();
  }
});

document.getElementById("modalOverlay").addEventListener("click", function (e) {
  if (e.target === this) {
    document.getElementById("modalOverlay").classList.add("hidden");
    document.body.style.overflow = "";
    if (showingFavoritesOnly) {
      filterAndDisplayRecipes();
    }
  }
});

function showState(stateName) {
  loadingState.classList.add("hidden");
  errorState.classList.add("hidden");
  emptyState.classList.add("hidden");
  document.getElementById("emptyFavoritesState").classList.add("hidden");
  recipeGrid.classList.add("hidden");

  if (stateName === "loading") loadingState.classList.remove("hidden");
  if (stateName === "error") errorState.classList.remove("hidden");
  if (stateName === "empty") emptyState.classList.remove("hidden");
  if (stateName === "emptyFavorites") document.getElementById("emptyFavoritesState").classList.remove("hidden");
  if (stateName === "grid") recipeGrid.classList.remove("hidden");
}

function populateCuisineDropdown() {
  const cuisines = [];
  for (let i = 0; i < allRecipes.length; i++) {
    const cuisineName = allRecipes[i].cuisine;
    if (cuisines.includes(cuisineName) === false) {
      cuisines.push(cuisineName);
      cuisineDropdown.innerHTML += "<option value='" + cuisineName + "'>" + cuisineName + "</option>";
    }
  }
}

function setupEventListeners() {
  searchInput.addEventListener("input", function () {
    if (searchInput.value.length > 0) {
      searchClearBtn.classList.add("visible");
    } else {
      searchClearBtn.classList.remove("visible");
    }
    filterAndDisplayRecipes();
  });

  searchClearBtn.addEventListener("click", function () {
    searchInput.value = "";
    searchClearBtn.classList.remove("visible");
    filterAndDisplayRecipes();
  });

  cuisineDropdown.addEventListener("change", filterAndDisplayRecipes);
  difficultyDropdown.addEventListener("change", filterAndDisplayRecipes);

  favoritesToggleBtn.addEventListener("click", function () {
    showingFavoritesOnly = !showingFavoritesOnly;
    favoritesToggleBtn.classList.toggle("active", showingFavoritesOnly);
    favoritesToggleBtn.textContent = showingFavoritesOnly ? "♥ My Favorites" : "♡ My Favorites";
    filterAndDisplayRecipes();
  });
}

startApp();
