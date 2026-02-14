# StreamFlix Backend

## Overview
StreamFlix is a Netflix clone that allows users to browse a catalogue of movies, watch trailers, and manage their watchlist. The application features a secure admin panel for managing movie data.

## Tech Stack
- **Backend**: Node.js with Express
- **Database**: MongoDB (using Mongoose)
- **Authentication**: JWT for secure user authentication
- **File Storage**: Cloudinary for media uploads

## Features
### User Features
- User registration and login
- Browse movies by categories and search
- View movie details and trailers
- Manage watchlist (add/remove movies)

### Admin Features
- Secure admin login
- Add, edit, and delete movies
- Manage movie categories and genres
- View user reports (optional)

## Getting Started

### Prerequisites
- Node.js
- MongoDB (Atlas or local)
- Cloudinary account for file uploads

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd StreamFlix/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure your environment variables.

4. Start the application:
   ```
   npm run dev
   ```

### API Endpoints
- **Authentication**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login and receive a JWT

- **Movies**
  - `GET /api/movies` - List all movies
  - `GET /api/movies/:slug` - Get movie details
  - `POST /api/admin/movies` - Add a new movie (admin only)
  - `PUT /api/admin/movies/:id` - Edit an existing movie (admin only)
  - `DELETE /api/admin/movies/:id` - Delete a movie (admin only)

### Testing
Run tests using:
```
npm test
```

## Deployment
The application can be deployed using Docker. Refer to the `Dockerfile` for instructions on building the Docker image.

## License
This project is licensed under the MIT License. See the LICENSE file for details.