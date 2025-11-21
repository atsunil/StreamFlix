# StreamFlix Frontend

## Overview
StreamFlix is a responsive streaming catalogue web application that allows users to browse movies, watch trailers, and manage their watchlist. The application features a secure admin panel for managing movie content.

## Features
- User authentication (register and login)
- Browse movies by categories and search functionality
- Movie detail pages with trailers
- Watchlist management for users
- Admin panel for adding, editing, and deleting movies

## Tech Stack
- **Frontend**: React
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT
- **File Storage**: Cloudinary/S3 for media uploads

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB Atlas account (for database)
- Cloudinary/S3 account (for media storage)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd StreamFlix/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file and fill in the required environment variables.

### Running the Application
To start the development server, run:
```
npm start
```
The application will be available at `http://localhost:3000`.

### Building for Production
To create a production build, run:
```
npm run build
```
The production files will be generated in the `build` directory.

## Testing
To run tests, use:
```
npm test
```

## Deployment
For deployment, consider using platforms like Vercel or Netlify for the frontend and ensure the backend is hosted on services like Heroku or Render.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.