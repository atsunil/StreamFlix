# 🚀 How to Deploy StreamFlix Frontend on Vercel

The backend is live! 🟢
**Backend URL**: `https://fierce-ilysa-notuco-cdf2ccfe.koyeb.app`

Now let's deploy the Frontend on Vercel and connect it to your live backend.

---

## Step 1: Create a Vercel Account
1.  Go to [Vercel.com](https://vercel.com/dummy).
2.  Sign up with **GitHub**.

## Step 2: Import Project
1.  Click **Add New...** -> **Project**.
2.  Find `atsunil/StreamFlix` and click **Import**.

## Step 3: Configure Project
1.  **Framework Preset**: It should auto-detect **Vite**.
2.  **Root Directory**:
    *   Click **Edit**.
    *   Select the `frontend` folder.
    *   Click **Continue**.

## Step 4: Environment Variables (Critical!)
This connects your frontend to your new backend.

1.  Click to expand **Environment Variables**.
2.  Add the following variable:
    *   **Key**: `VITE_API_URL`
    *   **Value**: `https://fierce-ilysa-notuco-cdf2ccfe.koyeb.app/api`
    *   *(Note: Make sure `/api` is at the end!)*

## Step 5: Deploy
1.  Click **Deploy**.
2.  Wait for the build to finish (about 1-2 minutes).
3.  Once done, you will see a screenshot of your app. Click the image to visit your live site!

🎉 **Congratulations! Your full-stack Netflix clone is live!**
