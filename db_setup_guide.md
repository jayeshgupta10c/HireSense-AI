# HireSense AI: MongoDB Integration Guide

Follow these steps to ensure your SaaS platform is properly connected to a persistent data layer.

## 1. Choose Your Database Environment

### Option A: MongoDB Atlas (Cloud - Recommended)
1. Sign up/Login to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Free Shared Cluster.
3. In **Network Access**, allow IP Address `0.0.0.0/0` (or your specific IP).
4. In **Database Access**, create a user with `readWriteAnyDatabase` role.
5. Get your Connection String: `mongodb+srv://<user>:<pass>@cluster0.abc.mongodb.net/?retryWrites=true&w=majority`

### Option B: Local MongoDB
1. Install MongoDB Community Edition.
2. Ensure the service is running on `localhost:27017`.
3. Connection String: `mongodb://localhost:27017`

---

## 2. Environment Configuration

Update your `backend/.env` file with the connection string:

```env
MONGODB_URL=mongodb+srv://your_user:your_pass@your_cluster.mongodb.net/hiresense?retryWrites=true&w=majority
DATABASE_NAME=hiresense
SECRET_KEY=yoursecretkeyhere
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 3. Verify Connection

1. Restart the FastAPI backend server.
2. Check the console output. You should see:
   `Connected to MongoDB: [hiresense]`
3. If you see a connection error:
   - Verify your IP is whitelisted in Atlas.
   - Check for special characters in your password (use URL encoding if necessary).

---

## 4. Production Readiness

> [!IMPORTANT]
> - **Security**: Never commit your `.env` file to version control (ensure it's in `.gitignore`).
> - **Persistence**: MongoDB is essential for saving User profiles, Analysis History, and Admin Monitoring data.
