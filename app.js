// ==============================
// 📌 CONSTANTS & SELECTORS
// ==============================
const STORAGE_KEY = "recipes";

const searchInput = document.getElementById("search");
const recipesContainer = document.getElementById("recipes");
const favoritesContainer = document.getElementById("favorites");

const modal = document.getElementById("modal");
const nameInput = document.getElementById("name");
const ingredientsInput = document.getElementById("ingredients");
const stepsInput = document.getElementById("steps");

const addBtn = document.getElementById("addBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

const overlay = document.getElementById("overlay");

let editingId = null;

// ==============================
// 🍳 DEFAULT RECIPES
// ==============================
const defaultRecipes = [
  {
    id: 1,
    name: "BBQ Chicken",
    ingredients: ["Chicken", "BBQ Sauce", "Garlic"],
    steps: ["Season chicken", "Add sauce", "Bake at 375°F for 30 min"],
    isFavorite: true
  },
  {
    id: 2,
    name: "Spaghetti",
    ingredients: ["Pasta", "Tomato Sauce"],
    steps: ["Boil pasta", "Heat sauce", "Combine and serve"],
    isFavorite: false
  }
];

// Load or initialize
let recipes = JSON.parse(localStorage.getItem(STORAGE_KEY));

if (!recipes || recipes.length === 0) {
  recipes = defaultRecipes;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRecipes));
}

// ==============================
// 💾 STORAGE
// ==============================
function saveRecipes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

// ==============================
// 🔍 RENDER
// ==============================
function renderRecipes(searchTerm = "") {
  recipesContainer.innerHTML = "";
  favoritesContainer.innerHTML = "";

  const query = searchTerm.toLowerCase();

  const filteredRecipes = recipes.filter(recipe => {
    const nameMatch = recipe.name.toLowerCase().includes(query);
    const ingredientMatch = recipe.ingredients.some(ing =>
      ing.toLowerCase().includes(query)
    );
    return nameMatch || ingredientMatch;
  });

  const favorites = filteredRecipes.filter(r => r.isFavorite);

  // ALL RECIPES
  if (filteredRecipes.length === 0) {
    recipesContainer.innerHTML = `
      <div class="empty">No recipes found.</div>
    `;
  } else {
    filteredRecipes.forEach(recipe => {
      recipesContainer.appendChild(createRecipeCard(recipe));
    });
  }

  // FAVORITES
  if (favorites.length === 0) {
    favoritesContainer.innerHTML = `
      <div class="empty">No favorites found.</div>
    `;
  } else {
    favorites.forEach(recipe => {
      favoritesContainer.appendChild(createRecipeCard(recipe));
    });
  }
}

// ==============================
// 🧱 CREATE CARD
// ==============================
function createRecipeCard(recipe) {
  const card = document.createElement("div");
  card.className = "recipe-card";

  const name = document.createElement("div");
  name.className = "recipe-name";
  name.textContent = recipe.name;

  const star = document.createElement("span");
  star.className = "favorite";
  star.textContent = recipe.isFavorite ? "⭐" : "☆";

  star.addEventListener("click", (e) => {
    e.stopPropagation();
    recipe.isFavorite = !recipe.isFavorite;
    saveRecipes();
    renderRecipes(searchInput.value);
  });

  const actions = document.createElement("div");
  actions.className = "recipe-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "btn-secondary btn-sm";
  editBtn.textContent = "Edit";

  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    editingId = recipe.id;

    nameInput.value = recipe.name;
    ingredientsInput.value = recipe.ingredients.join("\n");
    stepsInput.value = recipe.steps.join("\n");

    modal.classList.add("active");
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn-primary btn-sm";
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    recipes = recipes.filter(r => r.id !== recipe.id);
    saveRecipes();
    renderRecipes(searchInput.value);
  });

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  card.appendChild(name);
  card.appendChild(star);
  card.appendChild(actions);

  // Expand view
  card.addEventListener("click", () => {
    overlay.innerHTML = `
      <div class="expanded-card">
        <h3>${recipe.name}</h3>

        <h4>Ingredients</h4>
        <ul>
          ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
        </ul>

        <h4>Steps</h4>
        <ol>
          ${recipe.steps.map(s => `<li>${s}</li>`).join("")}
        </ol>
      </div>
    `;

    overlay.classList.add("active");
  });

  return card;
}

// ==============================
// 🪟 MODAL
// ==============================
addBtn.addEventListener("click", () => {
  editingId = null;

  nameInput.value = "";
  ingredientsInput.value = "";
  stepsInput.value = "";

  modal.classList.add("active");
});

cancelBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

saveBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const ingredients = ingredientsInput.value
    .split("\n")
    .map(i => i.trim())
    .filter(i => i);

  const steps = stepsInput.value
    .split("\n")
    .map(s => s.trim())
    .filter(s => s);

  if (!name) {
    alert("Recipe name is required");
    return;
  }

  if (editingId) {
    recipes = recipes.map(r =>
      r.id === editingId ? { ...r, name, ingredients, steps } : r
    );
  } else {
    recipes.push({
      id: Date.now(),
      name,
      ingredients,
      steps,
      isFavorite: false
    });
  }

  saveRecipes();
  renderRecipes(searchInput.value);
  modal.classList.remove("active");
});

// ==============================
// 🔍 DEBOUNCED SEARCH
// ==============================
function debounce(func, delay) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

const debouncedSearch = debounce((value) => {
  renderRecipes(value);
}, 300);

searchInput.addEventListener("input", (e) => {
  debouncedSearch(e.target.value);
});

// ==============================
// 🔒 OVERLAY CLOSE
// ==============================
overlay.addEventListener("click", () => {
  overlay.classList.remove("active");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    overlay.classList.remove("active");
  }
});

// ==============================
// 🚀 INIT
// ==============================
renderRecipes();