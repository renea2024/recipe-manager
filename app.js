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

// Default recipes
let recipes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  {
    id: Date.now(),
    name: "BBQ Chicken",
    ingredients: ["Chicken", "BBQ Sauce", "Garlic"],
    steps: ["Marinate chicken", "Grill chicken", "Serve with sauce"],
    isFavorite: true
  },
  {
    id: Date.now() + 1,
    name: "Spaghetti",
    ingredients: ["Pasta", "Tomato Sauce", "Salt"],
    steps: ["Boil pasta", "Prepare sauce", "Combine and serve"],
    isFavorite: false
  }
];

function saveRecipes() { localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes)); }

// Render recipes
function renderRecipes(searchTerm = "") {
  recipesContainer.innerHTML = "";
  favoritesContainer.innerHTML = "";

  const query = searchTerm.toLowerCase();
  const filteredRecipes = recipes.filter(r => r.name.toLowerCase().includes(query));

  const favorites = filteredRecipes.filter(r => r.isFavorite);

  filteredRecipes.forEach(recipe => recipesContainer.appendChild(createRecipeCard(recipe)));

  if (favorites.length === 0) favoritesContainer.innerHTML = `<div class="empty">No favorites found.</div>`;
  else favorites.forEach(recipe => favoritesContainer.appendChild(createRecipeCard(recipe)));
}

// Create recipe card
function createRecipeCard(recipe) {
  const card = document.createElement("div");
  card.className = "recipe-card";

  const header = document.createElement("div");
  header.className = "recipe-header";

  const name = document.createElement("div");
  name.className = "recipe-name";
  name.textContent = recipe.name;

  const star = document.createElement("span");
  star.className = "favorite";
  star.textContent = recipe.isFavorite ? "⭐" : "☆";
  star.addEventListener("click", e => { e.stopPropagation(); recipe.isFavorite = !recipe.isFavorite; saveRecipes(); renderRecipes(searchInput.value); });

  header.appendChild(name);
  header.appendChild(star);

  const actions = document.createElement("div");
  actions.className = "recipe-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", e => {
    e.stopPropagation();
    editingId = recipe.id;
    nameInput.value = recipe.name;
    ingredientsInput.value = recipe.ingredients.join("\n");
    stepsInput.value = recipe.steps.join("\n");
    modal.classList.add("active");
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", e => {
    e.stopPropagation();
    recipes = recipes.filter(r => r.id !== recipe.id);
    saveRecipes();
    renderRecipes(searchInput.value);
  });

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  card.appendChild(header);
  card.appendChild(actions);

  card.addEventListener("click", () => {
    overlay.innerHTML = `<div class="expanded-card">
      <h3>${recipe.name}</h3>
      <div class="section">
        <h4>Ingredients</h4>
        <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
      </div>
      <div class="section">
        <h4>Steps</h4>
        <ol>${recipe.steps.map(s => `<li>${s}</li>`).join("")}</ol>
      </div>
    </div>`;
    overlay.classList.add("active");
  });

  return card;
}

// Modal logic
addBtn.addEventListener("click", () => {
  editingId = null;
  nameInput.value = "";
  ingredientsInput.value = "";
  stepsInput.value = "";
  modal.classList.add("active");
});

cancelBtn.addEventListener("click", () => modal.classList.remove("active"));

saveBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const ingredients = ingredientsInput.value.split("\n").map(i => i.trim()).filter(Boolean);
  const steps = stepsInput.value.split("\n").map(s => s.trim()).filter(Boolean);

  if (!name) return alert("Recipe name is required");
  if (ingredients.length === 0) return alert("Enter at least one ingredient");
  if (steps.length === 0) return alert("Enter at least one step");

  if (editingId) {
    recipes = recipes.map(r => r.id === editingId ? {...r, name, ingredients, steps} : r);
  } else {
    recipes.push({id: Date.now(), name, ingredients, steps, isFavorite: false});
  }

  saveRecipes();
  renderRecipes(searchInput.value);
  modal.classList.remove("active");
});

// Search
searchInput.addEventListener("input", e => renderRecipes(e.target.value));

// Overlay close
overlay.addEventListener("click", () => overlay.classList.remove("active"));
document.addEventListener("keydown", e => { if(e.key === "Escape") overlay.classList.remove("active"); });

// Initial render
renderRecipes();