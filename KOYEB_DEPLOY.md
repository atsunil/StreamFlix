# 🚀 How to Deploy StreamFlix to Koyeb

Koyeb is a powerful and performant platform for deploying apps globally. Here’s how to deploy the **Backend** of StreamFlix on Koyeb.

> **Note**: For the Frontend, we still recommend using **Vercel** as it's optimized specifically for static sites like React/Vite. The backend is what needs a proper server, and Koyeb is perfect for that.

---

## Step 1: Create a Koyeb Account
1.  Go to [Koyeb.com](https://www.koyeb.com/).
2.  Sign up (free, no credit card required for the starter tier).

## Step 2: Deploy the Backend Service
1.  **Dashboard**: Once logged in, click **Create App** (or "Create Web Service").
2.  **Deployment Method**: Select **GitHub**.
3.  **Repository**:
    *   Find and select your repository: `atsunil/StreamFlix`.
    *   Branch: `main`.
4.  **Builder Configuration**:
    *   **Builder**: Choose **Node.js**.
    *   **Root Directory**: Set this to `backend` (⚠️ Very Important!).
        *   *If you miss this, the build will fail because it won't find `package.json`.*
    *   **Build Command**: Leave as `npm install`.
    *   **Run Command**: Leave as `npm start`.
5.  **Environment Variables**:
    *   Click **Add Variable**.
    *   Add `Key`: `DATABASE_URL`
    *   Add `Value`: Your MongoDB Connection String (e.g., from MongoDB Atlas).
    *   *(Optional)* Add `JWT_SECRET` with a secure random string (e.g., `supersecretkey123`).
6.  **Service Name**: Give it a name like `streamflix-backend`.
7.  **Regions**: Select a region close to you (e.g., Washington, D.C., Frankfurt, or Singapore). Note that free tier regions might be limited.
8.  **Instance Type**: Select **Nano** (Free).
9.  Click **Deploy**.

## Step 3: Wait & Verify
1.  Koyeb will start building your application. You can watch the "Runtime Logs".
2.  Once "Healthy", copy the **Public URL** (it will look like `https://streamflix-backend-atsunil.koyeb.app`).
3.  Test it by visiting `https://YOUR-APP-URL.koyeb.app/` in your browser. You should see `{"message":"StreamFlix API is running",...}`.

---

## Step 4: Connect with Frontend (Vercel)
Now that your backend is live on Koyeb, update your Frontend deployment on Vercel.

1.  Go to your project on **Vercel**.
2.  Go to **Settings** > **Environment Variables**.
3.  Edit `VITE_API_URL` to point to your new Koyeb Backend URL.
    *   Example: `https://streamflix-backend-atsunil.koyeb.app/api`
    *   (Make sure to keep `/api` at the end!)
4.  Go to **Deployments** and **Redeploy** the latest commit for changes to take effect.

🎉 **You're done!** Your app is now running on a high-performance cloud infrastructure.
