
const allRecipes = [];
const recipeGrid = document.getElementById("recipeGrid");
const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");
const searchClearBtn = document.getElementById("clearSearch");
const cuisineDropdown = document.getElementById("cuisineFilter");
const difficultyDropdown = document.getElementById("difficultyFilter");

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
    showState("empty");
    return;
  }

  showState("grid");
  recipeGrid.innerHTML = "";

  for (let i = 0; i < recipesToDisplay.length; i++) {
    const recipe = recipesToDisplay[i];
    const prepTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

    const cardHTML = `
      <article class="recipe-card" onclick="openRecipeModal(${recipe.id})">
        <div class="card-image-wrap">
          <img src="${recipe.image}" alt="${recipe.name}">
          <span class="card-badge">${recipe.cuisine}</span>
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

  document.getElementById("modalBody").innerHTML = `
    <img class="modal-hero-img" src="${recipeInfo.image}">
    <div class="modal-info">
      <h2 class="modal-title">${recipeInfo.name}</h2>
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

document.getElementById("modalClose").addEventListener("click", function() {
  document.getElementById("modalOverlay").classList.add("hidden");
  document.body.style.overflow = ""; 
});


function showState(stateName) {
  loadingState.classList.add("hidden");
  errorState.classList.add("hidden");
  emptyState.classList.add("hidden");
  recipeGrid.classList.add("hidden");

  if (stateName === "loading") loadingState.classList.remove("hidden");
  if (stateName === "error") errorState.classList.remove("hidden");
  if (stateName === "empty") emptyState.classList.remove("hidden");
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
  searchInput.addEventListener("input", function() {
    if (searchInput.value.length > 0) {
      searchClearBtn.classList.add("visible");
    } else {
      searchClearBtn.classList.remove("visible");
    }
    filterAndDisplayRecipes();
  });

  searchClearBtn.addEventListener("click", function() {
    searchInput.value = "";
    searchClearBtn.classList.remove("visible");
    filterAndDisplayRecipes();
  });

  cuisineDropdown.addEventListener("change", filterAndDisplayRecipes);
  difficultyDropdown.addEventListener("change", filterAndDisplayRecipes);
}

startApp();
