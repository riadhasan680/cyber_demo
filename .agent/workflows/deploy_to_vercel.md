---
description: How to deploy the Cybersecurity Dashboard to Vercel
---

# Deploying to Vercel

Since this project uses **MongoDB**, you cannot just deploy it without setting up a cloud database first. Local MongoDB (`mongodb://localhost...`) will NOT work on Vercel.

## Prerequisites

1.  **GitHub Account**: Push your code to a GitHub repository.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
3.  **MongoDB Atlas Account**: Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas).

## Step 1: Setup Cloud Database (MongoDB Atlas)

1.  Create a free cluster on MongoDB Atlas.
2.  Create a database user (username/password).
3.  Allow access from anywhere (`0.0.0.0/0`) in Network Access (or allow Vercel IP if you know it).
4.  Get your **Connection String**. It looks like:
    `mongodb+srv://<username>:<password>@cluster0.mongodb.net/cyber-demo?retryWrites=true&w=majority`

## Step 2: Push Code to GitHub

Run these commands in your terminal:

```bash
git init
git add .
git commit -m "Initial commit"
# Create a new repo on GitHub and copy the remote URL
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## Step 3: Deploy on Vercel

1.  Go to your Vercel Dashboard.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.
4.  **IMPORTANT**: In the "Environment Variables" section, add:
    - `MONGODB_URI`: Paste your MongoDB Atlas connection string.
    - `JWT_SECRET`: Paste your secret key (or generate a new long random string).
5.  Click **"Deploy"**.

## Step 4: Finalize

1.  Once deployed, visit your Vercel URL.
2.  Go to `/login`.
3.  Click **[ INITIALIZE_SYSTEM_DB ]** to seed your cloud database.
4.  Login with `admin` / `admin123`.
