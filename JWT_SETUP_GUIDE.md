# Complete Setup Guide - Blog App with JWT Authentication

## 🗄️ Database Setup

### Step 1: Drop All Existing Tables

1. Go to your Neon Database Console: https://console.neon.tech/
2. Navigate to your database
3. Open the SQL Editor
4. Run the script from `drop_tables.sql`:

```sql
DROP TABLE IF EXISTS "HomeApp_comment" CASCADE;
DROP TABLE IF EXISTS "HomeApp_post" CASCADE;
DROP TABLE IF EXISTS "auth_user_user_permissions" CASCADE;
DROP TABLE IF EXISTS "auth_user_groups" CASCADE;
DROP TABLE IF EXISTS "auth_user" CASCADE;
DROP TABLE IF EXISTS "auth_permission" CASCADE;
DROP TABLE IF EXISTS "auth_group_permissions" CASCADE;
DROP TABLE IF EXISTS "auth_group" CASCADE;
DROP TABLE IF EXISTS "django_admin_log" CASCADE;
DROP TABLE IF EXISTS "django_content_type" CASCADE;
DROP TABLE IF EXISTS "django_migrations" CASCADE;
DROP TABLE IF EXISTS "django_session" CASCADE;
```

### Step 2: Create New Database Schema

Run the script from `create_new_database.sql` in Neon SQL Editor:

This will create:

- `users` table (id, username, password, created_at)
- `posts` table (id, title, content, author_id, created_at, updated_at)
- Sample users and posts

## 🐍 Backend Setup (Django)

### Step 1: Install Dependencies

```powershell
cd "c:\Users\mudas\Documents\mid lab\Blog-django-react-postgres\Blog"
pip install -r requirements.txt
```

This will install:

- Django 5.2
- djangorestframework
- djangorestframework-simplejwt (NEW - for JWT authentication)
- django-cors-headers
- psycopg2-binary
- python-dotenv

### Step 2: Run Migrations

```powershell
python manage.py makemigrations
python manage.py migrate
```

### Step 3: Create Django Superuser (Optional)

```powershell
python manage.py createsuperuser
```

### Step 4: Start Django Server

```powershell
python manage.py runserver
```

Server will run at: http://127.0.0.1:8000

## ⚛️ Frontend Setup (React)

### Step 1: Update HomePage.js

Replace the content of `src/HomePage.js` with the content from `src/HomePage_JWT.js`

Or simply rename:

```powershell
cd "c:\Users\mudas\Documents\mid lab\Blog-django-react-postgres\blog-frontend\src"
# Backup old file
mv HomePage.js HomePage_OLD.js
# Use new JWT version
mv HomePage_JWT.js HomePage.js
```

### Step 2: Start React Server

```powershell
cd "c:\Users\mudas\Documents\mid lab\Blog-django-react-postgres\blog-frontend"
npm start
```

App will run at: http://localhost:3000

## 🔑 API Endpoints

### Authentication Endpoints

- **POST** `/api/auth/signup/` - Register new user

  ```json
  {
    "username": "john",
    "password": "password123"
  }
  ```

  Response:

  ```json
  {
    "message": "User created successfully",
    "user": { "id": 1, "username": "john" },
    "tokens": {
      "refresh": "eyJ...",
      "access": "eyJ..."
    }
  }
  ```

- **POST** `/api/auth/login/` - Login user

  ```json
  {
    "username": "john",
    "password": "password123"
  }
  ```

- **GET** `/api/auth/current-user/` - Get current user (requires Bearer token)
  ```
  Authorization: Bearer eyJ...
  ```

### Posts Endpoints

- **GET** `/api/posts/` - List all posts (public)
- **GET** `/api/posts/{id}/` - Get single post (public)
- **POST** `/api/posts/` - Create post (requires auth)
  ```json
  {
    "title": "My Post",
    "content": "Post content here"
  }
  ```
- **PUT** `/api/posts/{id}/` - Update post (author only)
- **DELETE** `/api/posts/{id}/` - Delete post (author only)

## 🔐 How JWT Authentication Works

1. **User Signs Up or Logs In**

   - Frontend sends username/password to `/api/auth/signup/` or `/api/auth/login/`
   - Backend returns access token and refresh token
   - Frontend stores tokens in localStorage

2. **Making Authenticated Requests**

   - Frontend includes token in Authorization header:
     ```
     Authorization: Bearer <access_token>
     ```
   - Backend validates token and returns user info

3. **Token Expiration**
   - Access token expires after 1 hour
   - Refresh token expires after 7 days
   - Use refresh token to get new access token (implement token refresh if needed)

## 📋 Features

### ✅ Anyone Can:

- View all posts
- Click on a post to view full details

### 🔒 Logged-in Users Can:

- Create new posts
- Delete their own posts

## 🎯 Testing the Application

1. **Start both servers**:

   - Django: http://127.0.0.1:8000
   - React: http://localhost:3000

2. **Create an account**:

   - Click "Sign Up" in navigation
   - Enter username and password
   - You'll be automatically logged in

3. **Create a post**:

   - Click "Create Post" button
   - Fill in title and content
   - Submit

4. **View posts**:

   - All posts displayed on homepage
   - Click any post to view full content

5. **Delete your post**:
   - Open a post you created
   - Click "Delete" button (only visible for your posts)

## 🔄 Key Changes from Session Auth

| Feature          | Old (Session)                     | New (JWT)                      |
| ---------------- | --------------------------------- | ------------------------------ |
| Auth Method      | Cookies/Sessions                  | Bearer Tokens                  |
| Login Endpoint   | `/accounts/login/` (Django form)  | `/api/auth/login/` (JSON API)  |
| Signup Endpoint  | `/accounts/signup/` (Django form) | `/api/auth/signup/` (JSON API) |
| Storage          | Server-side sessions              | Client-side tokens             |
| Headers          | CSRF Token                        | Authorization: Bearer          |
| State Management | Django templates                  | React state + localStorage     |

## 🐛 Troubleshooting

### Issue: "Import errors" in Python files

- **Solution**: These are lint errors. Install packages first:
  ```powershell
  pip install -r requirements.txt
  ```

### Issue: CORS errors in browser

- **Solution**: Check that `CORS_ALLOW_ALL_ORIGINS = True` in settings.py

### Issue: "Authentication credentials were not provided"

- **Solution**: Make sure you're including the Bearer token:
  ```javascript
  headers: {
    'Authorization': `Bearer ${token}`
  }
  ```

### Issue: "Invalid token"

- **Solution**: Token may have expired. Login again to get a new token.

## 📦 Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Posts Table

```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🚀 Next Steps

1. Implement token refresh mechanism
2. Add password strength validation
3. Add user profile pages
4. Add post editing functionality
5. Add search and filtering
6. Add pagination controls in UI
7. Add loading states and better error handling

---

**Note**: This setup uses JWT authentication which is stateless and more suitable for modern single-page applications. Tokens are stored in localStorage and sent with each request.
