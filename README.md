# 🍽️ RecipeLore — Recipe Finder

A clean, responsive web app built with **Vanilla JS, CSS3, and HTML5** that fetches and displays recipes from the [DummyJSON Recipes API](https://dummyjson.com/recipes).

---

## 📸 Preview

Browse, search, filter, and explore recipes — all without a single framework.  
Dark mode, favourites, pagination, and rich detail modals included.

---

## 🚀 Features

### Core (Milestones 2 & 3)
| Feature | Details |
|---|---|
| 🌐 API Integration | Fetches all recipes from `dummyjson.com/recipes` on load |
| 🔍 Debounced Search | Live search by name, cuisine, or tag (380 ms debounce) |
| 🗂️ Filter by Cuisine | Dropdown populated dynamically from API data |
| ⚖️ Filter by Difficulty | Easy / Medium / Hard |
| ↕️ Multi-criteria Sort | Rating, Calories, Cook time, Name (A→Z) |
| ❤️ Favourites | Save/unsave recipes; persistent via Local Storage |
| 🌙 Dark / Light Mode | Theme toggle, persisted in Local Storage |
| 📄 Recipe Detail Modal | Full ingredients, step-by-step instructions, stats |
| 📱 Responsive Design | Mobile, tablet, and desktop layouts |

### Bonus
| Feature | Details |
|---|---|
| ⏱️ Debouncing | Search input debounced — no API call on every keystroke |
| 📑 Pagination | 12 cards per page with Prev / Next navigation |
| 💾 Local Storage | Favourites and theme preference persist across sessions |
| ⏳ Loading Skeletons | Animated skeleton cards while fetching data |
| 🎨 Smooth Animations | Card fade-up, modal slide-up, hover transitions |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Structure and semantics |
| **CSS3** | Styling, CSS variables, responsive layout, animations |
| **Vanilla JavaScript (ES6+)** | API calls, DOM manipulation, all logic |
| **DummyJSON Recipes API** | Recipe data source |

---

## ⚙️ Array HOF Usage (Requirement)

All search, filter, and sort operations are implemented using JavaScript **Array Higher-Order Functions only**. No `for` or `while` loops are used for data operations.

| HOF | Used for |
|---|---|
| `.filter()` | Search, cuisine filter, difficulty filter, favourites-only view |
| `.sort()` | Sorting by rating, calories, time, name |
| `.map()` | Rendering recipe cards and modal content from data |
| `.find()` | Looking up a recipe by ID from cached data |
| `.reduce()` | Building the unique list of cuisine options |
| `.some()` | Checking if any field matches the search query |

---

## 📁 Project Structure

```
recipe-finder/
├── index.html     # Main HTML — layout, skeleton, modal, drawer
├── style.css      # Styles — CSS variables, dark mode, responsive
├── app.js         # All JS — API, HOFs, state, events, local storage
└── README.md      # This file
```

---

## 🌐 API Reference

**Base URL:** `https://dummyjson.com/recipes`

| Endpoint | Description |
|---|---|
| `GET /recipes?limit=0` | Fetch all recipes |
| `GET /recipes/:id` | Fetch a single recipe by ID |
| `GET /recipes/search?q={query}` | Search recipes by name |

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
  "reviewCount": 98,
  "tags": ["pizza", "italian"],
  "mealType": ["Dinner"]
}
```

---

## ⚡ Getting Started

**No build tools or package managers required.**

### Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/rahil-bit/recipe-finder.git
   cd recipe-finder
   ```

2. Open `index.html` in your browser, or use VS Code Live Server:
   > Right-click `index.html` → **Open with Live Server**

---

## 📌 Notes

- DummyJSON is a free mock API — data is fictional and for demo use only
- No API key is required
- CORS is fully supported; all requests are made directly from the browser
- Favourites and theme are saved in `localStorage` and persist across sessions
