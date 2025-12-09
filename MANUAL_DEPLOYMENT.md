# Manual Deployment Guide for Render

Step-by-step instructions to manually deploy the Employee Management System on Render without using Blueprint.

## Prerequisites

1. ✅ Code pushed to GitHub/GitLab/Bitbucket
2. ✅ Render account created at [render.com](https://render.com)
3. ✅ MongoDB Atlas account (free tier) OR Render MongoDB service

---

## Step 1: Set Up MongoDB (Choose One Option)

### Option A: MongoDB Atlas (Recommended - Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/Login → Create a free cluster
3. **Create Database User:**
   - Go to **Database Access** → **Add New Database User**
   - Username: `render-user` (or your choice)
   - Password: Generate secure password (save it!)
   - Database User Privileges: **Read and write to any database**
   - Click **Add User**

4. **Whitelist IP Address:**
   - Go to **Network Access** → **Add IP Address**
   - Click **Allow Access from Anywhere** (adds `0.0.0.0/0`)
   - Or add specific Render IPs if preferred
   - Click **Confirm**

5. **Get Connection String:**
   - Go to **Clusters** → Click **Connect**
   - Choose **Connect your application**
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Replace `<password>` with your database user password
   - Add database name: `mongodb+srv://username:password@cluster.mongodb.net/ultraship_employees`
   - **Save this connection string** - you'll need it in Step 2

### Option B: Render MongoDB (Paid)

1. In Render Dashboard → **New +** → **MongoDB**
2. Configure:
   - **Name:** `ultraship-mongodb`
   - **Plan:** Starter ($15/month)
   - **Region:** Oregon (or your choice)
3. Click **Create**
4. Once created, go to the MongoDB service → **Info** tab
5. Copy the **Internal Connection String** or **External Connection String**
6. **Save this connection string** - you'll need it in Step 2

---

## Step 2: Deploy Backend Service

1. **In Render Dashboard:**
   - Click **New +** → **Web Service**

2. **Connect Repository:**
   - Connect your GitHub/GitLab/Bitbucket account if not already connected
   - Select your repository: `employee-management-system`

3. **Configure Service:**
   - **Name:** `ultraship-backend`
   - **Region:** `Oregon` (or closest to your users)
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free` (or `Starter` for always-on)

4. **Set Environment Variables:**
   Click **Advanced** → **Add Environment Variable** and add:

   ```
   NODE_ENV = production
   ```

   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/ultraship_employees
   ```
   *(Use the connection string from Step 1)*

   ```
   JWT_SECRET = [Generate a strong secret]
   ```
   *(Generate using: `openssl rand -base64 32` in terminal, or use an online generator)*

   ```
   JWT_EXPIRES_IN = 30d
   ```

   ```
   FRONTEND_URL = https://ultraship-frontend.onrender.com
   ```
   *(We'll update this after frontend deploys - use placeholder for now)*

5. **Health Check:**
   - **Health Check Path:** `/health`

6. **Click "Create Web Service"**
   - Wait for deployment (5-10 minutes)
   - Note the backend URL (e.g., `https://ultraship-backend.onrender.com`)

---

## Step 3: Deploy Frontend Service

1. **In Render Dashboard:**
   - Click **New +** → **Static Site**

2. **Connect Repository:**
   - Select the same repository: `employee-management-system`

3. **Configure Service:**
   - **Name:** `ultraship-frontend`
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Set Environment Variables:**
   Click **Add Environment Variable** and add:

   ```
   VITE_GRAPHQL_URL = https://ultraship-backend.onrender.com/graphql
   ```
   *(Use the actual backend URL from Step 2)*

   ```
   VITE_ENV = production
   ```

5. **Click "Create Static Site"**
   - Wait for deployment (3-5 minutes)
   - Note the frontend URL (e.g., `https://ultraship-frontend.onrender.com`)

---

## Step 4: Update Backend Configuration

1. **Update FRONTEND_URL:**
   - Go to **ultraship-backend** service → **Environment** tab
   - Find `FRONTEND_URL` environment variable
   - Update value to: `https://ultraship-frontend.onrender.com` (use actual frontend URL)
   - Click **Save Changes**

2. **Restart Backend:**
   - Go to **ultraship-backend** service → **Manual Deploy** tab
   - Click **Clear build cache & deploy** (or just **Deploy latest commit**)

---

## Step 5: Verify Deployment

### Test Backend:
1. Visit: `https://ultraship-backend.onrender.com/health`
   - Should return: `{"status":"ok",...}`

2. Visit: `https://ultraship-backend.onrender.com/graphql`
   - Should show GraphQL Playground

### Test Frontend:
1. Visit: `https://ultraship-frontend.onrender.com`
   - Should load the application without errors

---

## Step 6: Seed Database (Optional)

To add initial test data:

1. **Option A: Using Render Shell:**
   - Go to **ultraship-backend** service → **Shell** tab
   - Run: `npm run seed`
   - Wait for completion

2. **Option B: Using MongoDB Compass:**
   - Connect to your MongoDB instance
   - Import seed data manually

---

## Quick Reference: Environment Variables

### Backend (`ultraship-backend`)
| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | |
| `MONGODB_URI` | `mongodb+srv://...` | From Step 1 |
| `JWT_SECRET` | `[random string]` | Generate with `openssl rand -base64 32` |
| `JWT_EXPIRES_IN` | `30d` | |
| `FRONTEND_URL` | `https://ultraship-frontend.onrender.com` | Update after frontend deploys |

### Frontend (`ultraship-frontend`)
| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_GRAPHQL_URL` | `https://ultraship-backend.onrender.com/graphql` | Use actual backend URL |
| `VITE_ENV` | `production` | |

---

## Troubleshooting

### Backend won't start
- ✅ Check all environment variables are set
- ✅ Verify `MONGODB_URI` is correct (test connection)
- ✅ Check build logs for errors
- ✅ Ensure `JWT_SECRET` is set

### Frontend shows blank page
- ✅ Check browser console for errors
- ✅ Verify `VITE_GRAPHQL_URL` is correct
- ✅ Ensure backend is running and accessible
- ✅ Check that build completed successfully

### CORS errors
- ✅ Verify `FRONTEND_URL` in backend matches frontend URL exactly
- ✅ Ensure `FRONTEND_URL` includes `https://` (no trailing slash)
- ✅ Restart backend after updating `FRONTEND_URL`

### Database connection fails
- ✅ Verify MongoDB connection string is correct
- ✅ Check MongoDB network access allows all IPs (`0.0.0.0/0`)
- ✅ Ensure database user has proper permissions
- ✅ Test connection string in MongoDB Compass

---

## Enable Auto-Deploy (Recommended)

1. Go to each service → **Settings** tab
2. Enable **Auto-Deploy**
3. Now every git push will automatically deploy!

---

## Cost Summary

**Free Tier:**
- Backend: 750 hours/month (shared across all free services)
- Frontend: Unlimited (static sites are free)
- MongoDB Atlas: Free tier (512MB storage)

**Paid Options:**
- Backend Starter: $7/month (always-on, no spin-down)
- Render MongoDB: $15/month (if not using Atlas)

---

## Next Steps

- ✅ Test user registration/login
- ✅ Test employee CRUD operations
- ✅ Monitor logs for any errors
- ✅ Set up custom domain (optional)
- ✅ Enable auto-deploy for continuous deployment

---

**Need Help?**
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- Check service logs in Render Dashboard
