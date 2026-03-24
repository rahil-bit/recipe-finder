# 🍽️ Recipe Finder

A simple, lightweight web app built with **Vanilla JS**, **CSS3**, and **HTML5** that fetches and displays recipes from the [DummyJSON Recipes API](https://dummyjson.com/recipes).

---

## 📸 Preview

> Browse, search, and explore recipes — all without a single framework.

---

## 🚀 Features

- 🔍 **Search recipes** by name or keyword
- 📋 **Browse all recipes** fetched from the DummyJSON API
- 📄 **View recipe details** — ingredients, instructions, cook time, servings, and more
- 📱 **Responsive design** — works on desktop and mobile
- ⚡ **No frameworks** — pure HTML5, CSS3, and Vanilla JS

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure and semantics |
| CSS3 | Styling and responsive layout |
| Vanilla JavaScript (ES6+) | API calls, DOM manipulation, logic |
| [DummyJSON Recipes API](https://dummyjson.com/recipes) | Recipe data source |

---

## 📁 Project Structure

```
recipe-finder/
├── index.html        # Main HTML file
├── style.css         # Stylesheet
├── app.js            # Main JavaScript logic
└── README.md         # Project documentation
```

---

## 🌐 API Reference

Base URL: `https://dummyjson.com/recipes`

| Endpoint | Description |
|----------|-------------|
| `GET /recipes` | Fetch all recipes (paginated) |
| `GET /recipes/:id` | Fetch a single recipe by ID |
| `GET /recipes/search?q={query}` | Search recipes by name |
| `GET /recipes?limit=10&skip=0` | Paginate results |

**Example response fields:**

```json
{
  "id": 1,
  "name": "Classic Margherita Pizza",
  "ingredients": ["Pizza dough", "Tomato sauce", "..."],
  "instructions": ["Preheat oven...", "..."],
  "prepTimeMinutes": 20,
  "cookTimeMinutes": 30,
  "servings": 4,
  "difficulty": "Easy",
  "cuisine": "Italian",
  "caloriesPerServing": 300,
  "image": "https://cdn.dummyjson.com/recipe-images/1.webp",
  "rating": 4.6,
  "reviewCount": 98
}
```

---

## ⚙️ Getting Started

### Prerequisites

No build tools or package managers needed. Just a modern web browser.

### Run Locally

1. **Clone the repository**

```bash
git clone https://github.com/rahil-bit/recipe-finder.git
cd recipe-finder
```

2. **Open in browser**

Simply open `index.html` in your browser:

Or use a local development server for best results:

```bash
# Using VS Code Live Server extension (recommended)
# Right-click index.html → "Open with Live Server"
```

---

## 🔧 How It Works

1. On page load, `app.js` fetches recipes from `https://dummyjson.com/recipes`
2. The response is parsed and recipe cards are dynamically rendered into the DOM
3. Clicking a recipe card fetches full details via `/recipes/:id`
4. The search bar filters results using the `/recipes/search?q=` endpoint

---

## 📌 Notes

- The DummyJSON API is a **free mock API** — data is fictional and for development/demo use only
- No API key is required
- CORS is supported, so requests can be made directly from the browser

---

