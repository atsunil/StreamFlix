# 🚀 How to Deploy StreamFlix for Free

You can deploy StreamFlix for free using **Vercel** (Frontend) and **Render** (Backend).

## 1️⃣ Preparation
1.  Make sure your code is pushed to a **GitHub repository**.
2.  If you haven't already, sign up for [Vercel](https://vercel.com/) and [Render](https://render.com/) using your GitHub account.

---

## 2️⃣ Backend Deployment (Render)
1.  Go to the [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your `StreamFlix` GitHub repository.
4.  **Configuration**:
    *   **Name**: `streamflix-backend` (or similar)
    *   **Root Directory**: `backend` (Important! ⚠️)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
    *   **Instance Type**: Free
5.  **Environment Variables** (Optional for Demo):
    *   If you want a **persistent database**, create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas/database) and add:
        *   `DATABASE_URL`: `your_mongodb_connection_string`
    *   *Note: If you skip this, the app will use the in-memory database (data resets on restart).*
6.  Click **Create Web Service**.
7.  Wait for the deployment to finish. Copy the **Backend URL** (e.g., `https://streamflix-backend.onrender.com`).

---

## 3️⃣ Frontend Deployment (Vercel)
1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Import your `StreamFlix` repository.
4.  **Framework Preset**: It should auto-detect `Vite`.
5.  **Root Directory**:
    *   Click "Edit" and select the `frontend` folder.
6.  **Environment Variables**:
    *   Key: `VITE_API_URL`
    *   Value: `Your Backend URL from Step 2` (e.g., `https://streamflix-backend.onrender.com/api`)
    *   *Note: Make sure to include `/api` at the end!*
7.  Click **Deploy**.

---

## 🎉 Done!
Your app should now be live!
-   **Frontend**: `https://your-project.vercel.app`
-   **Backend**: `https://your-backend.onrender.com`

### Troubleshooting
-   **CORS Issues**: The backend is configured to allow all origins by default, so it should work out of the box.
-   **Images not loading**: The app uses mock images. If you implement file uploads, you'll need a Cloudinary account.
