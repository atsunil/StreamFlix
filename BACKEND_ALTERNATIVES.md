# 🌍 Alternatives to Render for Backend Hosting

If you prefer not to use Render, here are the best free or low-cost alternatives for hosting your Node.js backend.

## 1. Koyeb (Highly Recommended)
Koyeb offers a **Nano** free tier that is very similar to Render. It allows you to run a Node.js web service for free.
*   **Pros**: fast, no credit card required for starter, supports Docker and Git.
*   **Cons**: Regions are limited in the free tier.

### How to deploy on Koyeb:
1.  Sign up at [koyeb.com](https://www.koyeb.com/).
2.  Create a new **App**.
3.  Select **GitHub** as your deployment method.
4.  Choose your `StreamFlix` repository.
5.  **Builder**: Select `Node.js`.
6.  **Build Command**: `npm install`
7.  **Run Command**: `npm start`
8.  **Root Directory**: `backend` (Important!)
9.  Add your **Environment Variables** (`DATABASE_URL`, `JWT_SECRET`, etc.).
10. Click **Deploy**.

## 2. Railway (Trial / Low Cost)
Railway is extremely user-friendly but has moved to a trial model (you get $5 of free credit, then you need to upgrade). It's faster and more reliable than Render's free tier.
*   **Pros**: Extremely easy UI, fast builds, includes a database service (Postgres/Redis) easily.
*   **Cons**: Not permanently free (trial credits).

### How to deploy on Railway:
1.  Sign up at [railway.app](https://railway.app/).
2.  Click **New Project** > **Deploy from GitHub repo**.
3.  Select your repository.
4.  It will verify the project. You might need to add a service for the frontend and backend, or just deploy the backend.
5.  Go to **Settings** > **Root Directory** and set it to `backend`.
6.  Go to **Variables** and add your `DATABASE_URL` etc.

## 3. Fly.io
Fly.io runs your app close to users (Edge). They have a free allowance, but you usually need to provide a credit card to sign up.
*   **Pros**: Very fast, professional tooling (CLI based).
*   **Cons**: Requires CLI setup (`flyctl`), requires credit card.

## 4. Vercel (Serverless Backend)
You can deploy your Express app to Vercel as a serverless function, but it requires code changes (wrapping the app in a handler).
*   **Pros**: Free, same platform as frontend, very fast.
*   **Cons**: Cold starts, websockets don't work well, requires code adaptation.

## Summary Recommendation
If you want a **free** experience similar to Render without a credit card: **Use Koyeb**.
If you are okay with a trial or small monthly fee for better performance: **Use Railway**.
