// ===== Recipe Manager App - Starter JS =====

// 1️⃣ Sample Recipe Objects
const recipes = [
  {
    name: "BBQ Chicken",
    servings: 4,
    ingredients: ["Chicken", "BBQ Sauce", "Olive Oil", "Garlic", "Salt", "Pepper"],
    isFavorite: true,
    cookTime: 45
  },
  {
    name: "Spaghetti Bolognese",
    servings: 6,
    ingredients: ["Spaghetti", "Ground Beef", "Tomato Sauce", "Onion", "Garlic"],
    isFavorite: false,
    cookTime: 60
  }
];

// 2️⃣ Function to Render Recipes in the UI
function renderRecipes(recipeArray) {
  const container = document.getElementById("recipe-list"); // Make sure you have a <div id="recipe-list"></div> in HTML
  container.innerHTML = ""; // Clear previous content

  recipeArray.forEach(recipe => {
    // Create a recipe card
    const card = document.createElement("div");
    card.classList.add("recipe-card");

    // Recipe Name & Favorite Status
    const title = document.createElement("h2");
    title.textContent = recipe.name + (recipe.isFavorite ? " ⭐" : "");
    card.appendChild(title);

    // Servings and Cook Time
    const info = document.createElement("p");
    info.textContent = `Servings: ${recipe.servings} | Cook Time: ${recipe.cookTime} mins`;
    card.appendChild(info);

    // Ingredients List
    const list = document.createElement("ul");
    recipe.ingredients.forEach(ingredient => {
      const li = document.createElement("li");
      li.textContent = ingredient;
      list.appendChild(li);
    });
    card.appendChild(list);

    // Append card to container
    container.appendChild(card);
  });
}

// 3️⃣ Initial Render
renderRecipes(recipes);