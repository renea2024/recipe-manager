// ==============================
// 📌 GLOBAL CONSTANTS & SELECTORS
// ==============================

// Storage key
const STORAGE_KEY = "recipes";

// Inputs & UI
const searchInput = document.getElementById("search");
const recipesContainer = document.getElementById("recipes");
const favoritesContainer = document.getElementById("favorites");

// Modal عناصر
const modal = document.getElementById("modal");
const nameInput = document.getElementById("name");
const ingredientsInput = document.getElementById("ingredients");
const notesInput = document.getElementById("notes");

const addBtn = document.getElementById("addBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Track editing state
let editingId = null;


// ==============================
// 💾 LOCAL STORAGE
// ==============================

// Save to localStorage
function saveRecipes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

// Load from localStorage or fallback data
let recipes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  {
    id: Date.now(),
    name: "BBQ Chicken",
    ingredients: ["Chicken", "BBQ Sauce", "Garlic"],
    isFavorite: true
  },
  {
    id: Date.now() + 1,
    name: "Spaghetti",
    ingredients: ["Pasta", "Tomato Sauce"],
    isFavorite: false
  }
];


// ==============================
// 🔍 RENDER FUNCTION
// ==============================

/**
 * Render recipes based on search
 */
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

  // Render all
  filteredRecipes.forEach(recipe => {
    recipesContainer.appendChild(createRecipeCard(recipe));
  });

  // Render favorites
  if (favorites.length === 0) {
    favoritesContainer.innerHTML = `<div class="empty">No favorites found.</div>`;
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

  // Header
  const header = document.createElement("div");
  header.className = "recipe-header";

  const name = document.createElement("div");
  name.className = "recipe-name";
  name.textContent = recipe.name;

  // ⭐ Favorite toggle
  const star = document.createElement("span");
  star.className = "favorite";
  star.textContent = recipe.isFavorite ? "⭐" : "☆";

  star.addEventListener("click", () => {
    recipes = recipes.map(r =>
      r.id === recipe.id ? { ...r, isFavorite: !r.isFavorite } : r
    );
    saveRecipes();
    renderRecipes(searchInput.value);
  });

  header.appendChild(name);
  header.appendChild(star);

  // Content
  const content = document.createElement("div");
  content.className = "recipe-content";
  content.textContent =
    recipe.ingredients.join(", ") +
    (recipe.notes ? ` | Notes: ${recipe.notes}` : "");

  // Actions
  const actions = document.createElement("div");
  actions.className = "recipe-actions";

  // ✏️ Edit
  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.textContent = "Edit";

  editBtn.addEventListener("click", () => {
    editingId = recipe.id;

    nameInput.value = recipe.name;
    ingredientsInput.value = recipe.ingredients.join(", ");
    notesInput.value = recipe.notes || "";

    modal.classList.add("active");
  });

  // 🗑 Delete
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", () => {
    recipes = recipes.filter(r => r.id !== recipe.id);
    saveRecipes();
    renderRecipes(searchInput.value);
  });

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  // Append
  card.appendChild(header);
  card.appendChild(content);
  card.appendChild(actions);

  return card;
}


// ==============================
// 🪟 MODAL LOGIC
// ==============================

// Open modal (Add mode)
addBtn.addEventListener("click", () => {
  editingId = null;

  nameInput.value = "";
  ingredientsInput.value = "";
  notesInput.value = "";

  modal.classList.add("active");
});

// Close modal
cancelBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

// Save (Create or Update)
saveBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const ingredients = ingredientsInput.value
    .split(",")
    .map(i => i.trim())
    .filter(i => i);

  const notes = notesInput.value.trim();

  if (!name) {
    alert("Recipe name is required");
    return;
  }

  if (editingId) {
    // Update
    recipes = recipes.map(r =>
      r.id === editingId ? { ...r, name, ingredients, notes } : r
    );
  } else {
    // Create
    recipes.push({
      id: Date.now(),
      name,
      ingredients,
      notes,
      isFavorite: false
    });
  }

  saveRecipes();
  renderRecipes(searchInput.value);
  modal.classList.remove("active");
});


// ==============================
// 🔍 SEARCH
// ==============================

searchInput.addEventListener("input", (e) => {
  renderRecipes(e.target.value);
});


// ==============================
// 🚀 INIT
// ==============================

renderRecipes();