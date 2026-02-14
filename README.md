# StreamFlix

StreamFlix is a responsive streaming catalogue web application that allows users to browse movies, watch trailers, and manage their watchlists. The application features a secure admin panel for managing movie content, including adding, editing, and deleting movies.

# StreamFlix At Live
https://streamfl.netlify.app/

## Features

### User Features
- **User Registration and Login**: Users can create an account and log in securely.
- **Browse Movies**: Users can explore a wide range of movies, categorized by genres.
- **Movie Details**: Each movie has a dedicated detail page displaying information such as title, description, cast, and a trailer.
- **Watchlist Management**: Users can add or remove movies from their personal watchlist.

### Admin Features
- **Secure Admin Login**: Admins can log in to a protected area of the application.
- **Movie Management**: Admins can add new movies, edit existing ones, and delete movies from the catalogue.
- **Dashboard**: A comprehensive dashboard for viewing statistics and managing content.

## Tech Stack
- **Backend**: Node.js with Express
- **Database**: MongoDB (using Mongoose)
- **Authentication**: JWT (JSON Web Tokens) and bcrypt for password hashing
- **Frontend**: React
- **File Storage**: Cloudinary for media uploads
- **Deployment**: Docker for containerization, with hosting on platforms like Heroku and Vercel

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB Atlas account (or local MongoDB setup)
- Cloudinary account for media storage

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd StreamFlix
   ```

2. Set up the backend:
   - Navigate to the `backend` directory:
     ```
     cd backend
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Create a `.env` file based on `.env.example` and configure your environment variables.

3. Set up the frontend:
   - Navigate to the `frontend` directory:
     ```
     cd ../frontend
     ```
   - Install dependencies:
     ```
     npm install
     ```

4. Run the application:
   - Start the backend server:
     ```
     cd backend
     npm start
     ```
   - Start the frontend application:
     ```
     cd ../frontend
     npm start
     ```

## API Documentation
Refer to the backend README for detailed API endpoints and usage.

## Testing
The project includes tests for both the backend and frontend. To run tests, navigate to the respective directories and use:
```
npm test
```

## Deployment
For deployment instructions, refer to the respective Dockerfiles and CI/CD setup in the project.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
