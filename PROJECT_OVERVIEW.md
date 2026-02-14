# StreamFlix – Complete Project Documentation

## 1. Project Overview
StreamFlix is a full-stack Netflix-clone streaming catalogue web application. It allows users to browse movies, watch trailers (with hover-to-play preview on cards), manage personal watchlists, and receive genre-based recommendations. It includes a secure admin panel for full CRUD management of movie content.

**Live Demo:** https://streamfl.netlify.app/

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 7, React Router v6, Axios, React Hook Form, React Toastify |
| **Backend** | Node.js, Express 4, Mongoose (MongoDB ODM) |
| **Database** | MongoDB Atlas (Free Tier M0) — with an in-memory fallback (mongodb-memory-server) for local dev without a database |
| **Authentication** | JWT (jsonwebtoken) + bcrypt for password hashing |
| **File Storage** | Cloudinary (configured but optional; mock storage used as fallback) |
| **Security** | Helmet (HTTP headers), CORS, express-rate-limit, express-validator |
| **Dev Tools** | Nodemon (auto-restart), Jest + Supertest (testing), ESLint |
| **Containerization** | Docker + docker-compose |

---

## 3. Project Structure

```
StreamFlix-main/
├── .gitignore
├── README.md
├── DEPLOYMENT.md          # Step-by-step free deployment guide (Vercel + Render)
├── docker-compose.yml
│
├── backend/
│   ├── .env               # DATABASE_URL, JWT_SECRET, CLOUDINARY_URL, PORT, NODE_ENV
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── server.js       # Entry point: connects DB, seeds data, starts Express
│       ├── app.js          # Express app setup: middleware + route mounting
│       ├── config/
│       │   ├── db.js           # MongoDB connection helper
│       │   ├── cloudinary.js   # Cloudinary SDK config
│       │   └── memory-db.js    # In-memory MongoDB (MongoMemoryServer) for dev
│       ├── models/
│       │   ├── Movie.js        # Movie schema
│       │   ├── User.js         # User schema (with watchlist & recentlyWatched)
│       │   └── Review.js       # Review schema (rating 1-5 + comment)
│       ├── controllers/
│       │   ├── auth.controller.js    # register, login, getCurrentUser
│       │   ├── movies.controller.js  # getMovies, getMovieBySlug, createMovie, deleteMovie
│       │   ├── users.controller.js   # watchlist CRUD, recentlyWatched, recommendations
│       │   └── admin.controller.js   # admin CRUD for movies (create, update, delete, getAll)
│       ├── routes/
│       │   ├── auth.routes.js        # POST /register, POST /login, GET /me
│       │   ├── movies.routes.js      # GET /, GET /:slug, POST /, DELETE /:id
│       │   ├── users.routes.js       # Watchlist + recently watched + recommendations
│       │   └── admin.routes.js       # Admin-only movie management (auth + admin middleware)
│       ├── middleware/
│       │   ├── auth.middleware.js     # JWT verification → sets req.user
│       │   └── admin.middleware.js    # Checks req.user.role === 'admin'
│       ├── services/
│       │   └── upload.service.js     # Cloudinary upload helper
│       ├── utils/
│       │   ├── jwt.js              # JWT sign/verify helpers
│       │   ├── validators.js       # express-validator rules
│       │   └── mockStorage.js      # In-memory movie & user storage (no DB fallback)
│       └── tests/
│           ├── auth.test.js
│           └── movies.test.js
│
└── frontend/
    ├── .env               # VITE_API_URL=http://localhost:5000/api
    ├── .env.example
    ├── Dockerfile
    ├── index.html          # Vite entry HTML
    ├── vite.config.js      # Vite config (port 3000, React plugin)
    ├── package.json
    └── src/
        ├── main.jsx        # ReactDOM.createRoot entry
        ├── App.jsx         # Router, AuthProvider, ToastProvider, ErrorBoundary, Routes
        ├── api/
        │   └── api.js      # Axios API client (all backend calls)
        ├── context/
        │   ├── AuthContext.jsx   # Auth state: user, login, logout, register
        │   └── ToastContext.jsx  # Toast notification system
        ├── hooks/
        │   └── (custom hooks)
        ├── components/
        │   ├── Navbar.jsx / Navbar.css         # Fixed top nav: logo, links, search with suggestions, notifications, profile dropdown
        │   ├── MovieCard.jsx / MovieCard.css    # Movie poster card with hover-to-play trailer preview (YouTube iframe)
        │   ├── MovieDetailsModal.jsx / .css     # Full-screen modal with movie details, trailer, watchlist button
        │   ├── Carousel.jsx / Carousel.css      # Horizontal scrolling movie row
        │   ├── FilterBar.jsx / FilterBar.css    # Genre toggle, sort, language, year filter
        │   ├── MovieForm.jsx / MovieForm.css    # Admin movie add/edit form (multi-step wizard)
        │   ├── ProfileManager.jsx / .css        # User profile management
        │   ├── ProfileSelector.jsx / .css       # Profile selection UI
        │   ├── Skeleton.jsx                     # Loading skeleton placeholder
        │   └── VideoPlayer.jsx                  # HTML5 video player component
        ├── pages/
        │   ├── Home.jsx / Home.css              # Landing page: hero banner, carousels by genre, filters
        │   ├── MovieDetail.jsx / MovieDetail.css # Individual movie page with full details
        │   ├── Login.jsx / Login.css             # Login form
        │   ├── Register.jsx                      # Registration form
        │   ├── Watchlist.jsx / Watchlist.css     # User's saved movies
        │   ├── Profile.jsx / Profile.css         # User profile page
        │   └── admin/
        │       ├── Dashboard.jsx / Dashboard.css # Admin panel: stats, movie table, add/edit/delete
        │       └── MovieManager.jsx              # Movie management sub-component
        ├── styles/
        │   └── globals.css   # Global design system: CSS variables, glass cards, animations, buttons, forms, toasts
        └── tests/
            └── App.test.jsx
```

---

## 4. Database Schemas

### Movie Schema (`backend/src/models/Movie.js`)
```javascript
{
  title:          String (required, indexed),
  slug:           String (unique),
  description:    String,
  genres:         [String],             // e.g. ['Action', 'Sci-Fi', 'Thriller']
  releaseDate:    Date,
  runtimeMinutes: Number,
  cast:           [String],
  director:       String,
  language:       String,
  posterUrl:      String,               // Cloud/public URL for poster image
  trailerUrl:     String,               // YouTube embed URL for trailer
  videoUrl:       String,               // Optional, for full movie playback
  rating:         Number (default: 0),
  reviewsCount:   Number (default: 0),
  createdAt:      Date (default: now),
  updatedAt:      Date,
  isPublished:    Boolean (default: true)
}
```

### User Schema (`backend/src/models/User.js`)
```javascript
{
  name:            String (required),
  email:           String (required, unique),
  passwordHash:    String (required),
  role:            String (enum: ['user', 'admin'], default: 'user'),
  watchlist:       [ObjectId → Movie],     // Array of movie references
  recentlyWatched: [{
    movie:    ObjectId → Movie,
    watchedAt: Date (default: now),
    position:  Number (default: 0)          // Playback position in seconds
  }],
  createdAt:       Date (default: now)
}
```

### Review Schema (`backend/src/models/Review.js`)
```javascript
{
  user:      ObjectId → User (required),
  movie:     ObjectId → Movie (required),
  rating:    Number (required, min: 1, max: 5),
  comment:   String (required),
  createdAt: Date (default: now)
}
```

---

## 5. API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register a new user (name, email, password) |
| POST | `/api/auth/login` | ❌ | Login, returns JWT token + user object |
| GET | `/api/auth/me` | ✅ JWT | Get current authenticated user info |

### Movies (`/api/movies`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/movies` | ❌ | Get all published movies (limit 50) |
| GET | `/api/movies/:slug` | ❌ | Get single movie by slug |
| POST | `/api/movies` | ❌ | Create a new movie |
| DELETE | `/api/movies/:id` | ❌ | Delete a movie by ID |

### Users (`/api/users`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/me` | ✅ JWT | Get current user profile |
| GET | `/api/users/watchlist` | ✅ JWT | Get user's watchlist (populated) |
| POST | `/api/users/watchlist` | ✅ JWT | Add movie to watchlist (body: { movieId }) |
| DELETE | `/api/users/watchlist/:movieId` | ✅ JWT | Remove movie from watchlist |
| POST | `/api/users/recently-watched` | ✅ JWT | Update recently watched (body: { movieId, position }) |
| GET | `/api/users/recommendations` | ✅ JWT | Get genre-based recommendations from watch history |

### Admin (`/api/admin`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/movies` | ✅ JWT + Admin | Get ALL movies (including unpublished) |
| POST | `/api/admin/movies` | ✅ JWT + Admin | Create a new movie |
| PUT | `/api/admin/movies/:id` | ✅ JWT + Admin | Update a movie |
| DELETE | `/api/admin/movies/:id` | ✅ JWT + Admin | Delete a movie |

---

## 6. Authentication Flow
1. User registers with name, email, password → password is hashed with bcrypt (10 rounds) → saved to MongoDB.
2. User logs in → server compares bcrypt hash → generates JWT token (payload: `{ id, role }`, expires in 1 hour).
3. Token is stored in `localStorage` on the client.
4. Every authenticated request sends `Authorization: Bearer <token>` header.
5. `auth.middleware.js` verifies the JWT and sets `req.user = { id, role }`.
6. `admin.middleware.js` additionally checks `req.user.role === 'admin'`.

---

## 7. Key Frontend Features

### 7.1 Home Page (`Home.jsx`)
- **Hero Banner**: Auto-rotating slideshow of featured movies (cycles every 5 seconds) with backdrop poster image.
- **Filter Bar**: Genre toggles, sort by (newest/rating/popular), language filter, year range slider.
- **Carousels**: Horizontal scrolling rows grouped by genre. Also shows "Continue Watching" (with progress bars) and "Recommended For You" (for logged-in users).
- **Client-side filtering**: Search, genre, language, and year filters applied on fetched movie array.

### 7.2 Movie Card (`MovieCard.jsx`) — Hover-to-Play Preview
- On hover: After a 1.2-second delay, the poster is replaced with a muted, auto-playing YouTube trailer iframe (looping, no controls).
- The overlay with Play/Trailer/Add/Info buttons and the movie title + genre + year appears immediately on hover.
- On mouse leave: Video stops instantly, poster returns.
- The YouTube URL is automatically converted to an embed URL with `autoplay=1&mute=1&controls=0&loop=1`.

### 7.3 Search (Navbar)
- Real-time search suggestions as the user types.
- Fetches all movies and filters client-side by title.
- Shows poster thumbnails, title (with matched text highlighted in red), and year.
- Supports keyboard navigation (Arrow Up/Down, Enter to select, Escape to close).

### 7.4 Watchlist
- Add/remove movies from a personal watchlist.
- Data persisted to MongoDB via API calls.
- Watchlist page displays saved movies with remove buttons.

### 7.5 Recommendations Engine
- Based on the user's recently watched movies.
- Counts genre occurrences from watch history.
- Picks the top 3 genres and finds movies in those genres that haven't been watched yet.
- Returns up to 12 recommendations.

### 7.6 Admin Dashboard
- Protected route (redirects non-admin users).
- Shows stats: Total Movies, Published, Drafts.
- Table view of all movies with Edit and Delete actions.
- Modal form (MovieForm) for adding/editing movies with all fields.

---

## 8. Design System (`globals.css`)

### CSS Variables (Dark Theme)
```css
--primary-red:    #E50914      /* Netflix-style red */
--primary-hover:  #b20710
--bg-dark:        #0B0F14      /* Deep charcoal background */
--bg-mid:         #141821
--bg-light:       #1C1F2A
--bg-gradient:    linear-gradient(135deg, #0B0F14 0%, #141821 50%, #1C1F2A 100%)
--glass-bg:       rgba(255, 255, 255, 0.03)   /* Glassmorphism */
--glass-border:   rgba(255, 255, 255, 0.08)
--glass-blur:     blur(20px)
--text-main:      #E5E7EB
--text-muted:     #9CA3AF
--accent-cyan:    #6EE7F9
--accent-violet:  #8B5CF6
```

### Key Design Patterns
- **Glassmorphism**: `.glass-card` class with semi-transparent background, backdrop-filter blur, and subtle border.
- **Animations**: `fadeIn`, `slideUp`, `shimmer` (skeleton loading), `slideInRight` (toasts).
- **Typography**: Fonts — 'Inter' for body, 'Outfit' for headings.
- **Toast Notifications**: Fixed top-right container with success (green), error (red), and info (blue) variants.

---

## 9. Environment Variables

### Backend (`.env`)
```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/StreamFlix?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_URL=your_cloudinary_url    (optional)
PORT=5000
NODE_ENV=development
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000/api
```
*For production deployment, change to the deployed backend URL.*

---

## 10. How to Run Locally

```bash
# 1. Backend
cd backend
npm install
npm run dev          # Uses nodemon, runs on port 5000

# 2. Frontend (separate terminal)
cd frontend
npm install
npm start            # Vite dev server on port 3000
```

If `DATABASE_URL` is not set, the backend automatically:
- Starts an in-memory MongoDB instance (via mongodb-memory-server)
- Uses mock storage for auth
- Seeds 3 sample movies: Inception, The Matrix, Interstellar
- Creates an admin user: `admin@example.com` / `password123`

---

## 11. Deployment (Free Tier)
- **Backend** → [Render.com](https://render.com) (Free Web Service)
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Env vars: `DATABASE_URL`, `JWT_SECRET`
- **Frontend** → [Vercel.com](https://vercel.com) (Free)
  - Root Directory: `frontend`
  - Framework: Vite (auto-detected)
  - Env var: `VITE_API_URL` = deployed backend URL + `/api`
- **Database** → [MongoDB Atlas](https://www.mongodb.com/atlas) (Free M0 cluster)

---

## 12. Seeded Sample Data
On first startup with an empty database, the server automatically creates:

**3 Movies:**
1. **Inception** (2010) — Action, Sci-Fi, Thriller — Dir: Christopher Nolan
2. **The Matrix** (1999) — Action, Sci-Fi — Dir: Lana & Lilly Wachowski
3. **Interstellar** (2014) — Adventure, Drama, Sci-Fi — Dir: Christopher Nolan

**1 Admin User:**
- Email: `admin@example.com`
- Password: `password123`
- Role: `admin`

---

## 13. Docker Support
```yaml
# docker-compose.yml runs both services:
# - backend on port 5000
# - frontend on port 3000
docker-compose up --build
```
