# Amerie's Closet

A full-stack digital wardrobe manager and outfit builder. Upload your clothes, drag them together to build outfits, try them on over a photo of yourself, and share looks with other users.

---

## Features

- **Wardrobe Management** — Add tops and bottoms with photos, colors, and categories
- **Drag-and-Drop Outfit Builder** — Drag clothes onto a mannequin to assemble outfits visually
- **Try-On Mode** — Upload a photo of yourself and overlay your clothes on top of it
- **Outfit Saving** — Save outfits and browse them later
- **Outfit Sharing** — Share outfits with other users by username; view your shared inbox
- **Theming** — Four built-in themes (warm, dark, sakura, cyber) plus fully customizable colors, fonts, and background images
- **User Accounts** — Register/login with token-based auth; each user has their own private closet

---

## Tech Stack

| Layer    | Technology                  |
|----------|-----------------------------|
| Frontend | React 19, Create React App  |
| Backend  | FastAPI, Uvicorn            |
| Database | SQLite                      |
| Auth     | UUID session tokens, SHA256 password hashing |
| Images   | Multipart upload, served from `/uploads/` |

---

## Project Structure

```
ameries_closet/
├── backend/
│   └── app/
│       ├── main.py           # All FastAPI routes and request handling
│       ├── database.py       # SQLite schema and database operations
│       ├── schemas.py        # Pydantic models
│       ├── services/
│       │   └── services.py   # Service layer over database
│       ├── uploads/          # Uploaded clothing images
│       └── clothes.db        # SQLite database file
├── frontend/
│   ├── src/
│   │   ├── App.js            # Full React application
│   │   ├── App.css
│   │   └── index.js
│   ├── public/
│   └── package.json
├── start.sh                  # Convenience script to start the backend
└── venv2/                    # Python virtual environment
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm

### Backend

```bash
# From the project root
source venv2/bin/activate

cd backend/app
python main.py
```

The API will be running at `http://localhost:8000`.

The SQLite database (`clothes.db`) and uploads directory are created automatically on first run.

Alternatively, use the provided script from the project root:

```bash
bash start.sh
```

### Frontend

```bash
cd frontend
npm install
npm start
```

The React dev server runs at `http://localhost:3000` and proxies API requests to `http://localhost:8000` automatically.

### Production Build

```bash
cd frontend
npm run build
```

The FastAPI backend will serve the built frontend from `frontend/build/` — just run the backend and visit `http://localhost:8000`.

---

## API Overview

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/register` | Create a new account |
| POST | `/auth/login` | Login and receive a session token |
| POST | `/auth/logout` | Invalidate current session |

### Clothing
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/clothing` | List all clothing items for the logged-in user |
| POST | `/clothing` | Add a new clothing item |
| DELETE | `/clothing/{id}` | Delete a clothing item |
| GET | `/clothing/tops` | Get only tops |
| GET | `/clothing/bottoms` | Get only bottoms |
| POST | `/upload` | Upload an image file |

### Outfits
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/outfit` | List saved outfits |
| POST | `/outfit` | Save a new outfit |
| DELETE | `/outfit/{id}` | Delete a saved outfit |

### Sharing
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/share` | Share an outfit with another user |
| GET | `/shared` | View outfits shared with you |
| DELETE | `/shared/{id}` | Dismiss a shared outfit |

All protected routes require an `Authorization: <token>` header obtained from `/auth/login`.

---

## Database Schema

```
users           id, username, password_hash, created_at
sessions        token, user_id, created_at
clothing_item   id, category, item_type, color, image_path, user_id
outfit          id, top_id, bottom_id, user_id, created_at
shared_outfits  id, top_id, bottom_id, from_user_id, to_user_id, created_at
```

---

## Planned / In Progress

- ML-based outfit suggestions so users don't have to type category/color manually
- Fix settings gear visibility on mobile

---

## License

Personal project. All rights reserved.
