# Recipe Manager

A simple, interactive Recipe Manager web app built with **HTML, CSS, and JavaScript**.  
Save, search, favorite, and delete recipes with a clean, mobile-friendly interface. Recipes persist in **localStorage**, so your data stays in the browser.

---

## Features

- Add new recipes with **name**, **ingredients**, and **notes**.
- Mark recipes as **favorites** (⭐) to quickly access them.
- **Delete recipes** you no longer need.
- **Search recipes** by name or ingredients.
- **Responsive design** for desktop and mobile screens.
- Data is saved in **localStorage**, so recipes persist between sessions.

---

## Folder Structure

recipe-manager/
- index.html          # Main HTML file
- style.css           # Stylesheet
- app.js              # JavaScript functionality
- README.md           # Project documentation

---

## How It Works

1. **Add Recipe**
   - Click `+ Add Recipe` in the header.
   - Fill in recipe name, ingredients (comma separated), and optional notes.
   - Click **Save** to store it in localStorage.

2. **View Recipes**
   - Recipes are displayed in two sections:
     - **All Recipes**
     - **Favorites**
   - Click the star ⭐ to toggle favorite status.

3. **Delete Recipe**
   - Click **Delete** on any recipe card to remove it permanently.

4. **Search**
   - Use the search bar to filter recipes by name or ingredients in real-time.

5. **Persistence**
   - All changes are automatically saved to your browser using localStorage.

---

## Tech Stack

- **HTML5** – Structure of the app
- **CSS3** – Styling and responsive design
- **JavaScript (Vanilla)** – App logic, DOM manipulation, and localStorage persistence

---

## Usage

1. Clone the repo:

`git clone https://github.com/renea2024/recipe-manager.git`

2. Open `index.html` in your browser.
3. Start adding, searching, favoriting, and deleting recipes.

---

## Planned Improvements
- Implement **drag-and-drop** sorting for recipes.
- Add **export/import recipes** to JSON.
- Improve accessibility and keyboard navigation.

---

## License

This project is licensed under the **MIT License**.