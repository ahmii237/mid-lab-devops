# 🚀 Quick Start Guide - Blog with JWT Authentication

## ✅ What's Already Set Up

### Backend (Django)

- ✅ User model (Django's built-in auth_user: username, password)
- ✅ Post model (title, content, author)
- ✅ JWT authentication configured
- ✅ API endpoints ready

### Frontend (React)

- ✅ JWT authentication (Login/Signup modals)
- ✅ View all posts
- ✅ Click post to view details
- ✅ Create post (logged-in users only)
- ✅ Delete own posts

## 🎯 How to Run

### 1. Start Django Backend

```powershell
cd "c:\Users\mudas\Documents\mid lab\Blog-django-react-postgres\Blog"
python manage.py runserver
```

Runs at: **http://127.0.0.1:8000**

### 2. Start React Frontend

```powershell
cd "c:\Users\mudas\Documents\mid lab\Blog-django-react-postgres\blog-frontend"
npm start
```

Runs at: **http://localhost:3000**

## 📡 API Endpoints

### Authentication

- **POST** `/api/auth/signup/` - Create account
- **POST** `/api/auth/login/` - Login
- **GET** `/api/auth/current-user/` - Get current user (requires token)

### Posts

- **GET** `/api/posts/` - List all posts (public)
- **GET** `/api/posts/{id}/` - Get single post (public)
- **POST** `/api/posts/` - Create post (requires auth)
- **DELETE** `/api/posts/{id}/` - Delete post (author only)

## 🔑 How It Works

### Sign Up

1. Click "Sign Up" button
2. Enter username and password
3. Automatically logged in with JWT token

### Login

1. Click "Login" button
2. Enter credentials
3. JWT token saved to localStorage

### Create Post

1. Must be logged in
2. Click "+ Create Post" button
3. Fill title and content
4. Post saved with your username

### View Posts

1. All posts shown on homepage
2. Click any post to view full details
3. See author name and date

### Delete Post

1. Only see delete button on YOUR posts
2. Click "Delete Post" button
3. Confirm deletion

## 🗄️ Database Tables

Django automatically created:

- **auth_user** - Users (id, username, password)
- **posts** - Blog posts (id, title, content, author_id, created_at, updated_at)

## 🛠️ Technologies Used

- **Backend**: Django 5.2 + Django REST Framework + Simple JWT
- **Frontend**: React + JavaScript
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT (Bearer tokens)

## 📝 Test Flow

1. **Start both servers**
2. **Go to** http://localhost:3000
3. **Click "Sign Up"** and create account (e.g., username: "john", password: "test123")
4. **You're auto logged in** - see "Hello, john!" in nav
5. **Click "+ Create Post"** - add your first post
6. **View all posts** on homepage
7. **Click a post** to see full details
8. **Delete your post** (button only shows on your posts)

## 🎨 Features

### ✅ Public Features

- View all posts
- Read full post details
- See post author and date

### 🔒 Authenticated Features

- Create new posts
- Delete own posts
- Personalized greeting in nav

## 🔧 Customization

### Change Colors

Edit `HomePage.js` inline styles:

- Primary color: `#667eea` (purple)
- Success color: `#48bb78` (green)
- Danger color: `#ef4444` (red)

### Add More Fields

1. Update `Post` model in `models.py`
2. Run `python manage.py makemigrations`
3. Run `python manage.py migrate`
4. Update `PostSerializer` in `serializers.py`
5. Update React form in `HomePage.js`

## 🐛 Troubleshooting

**"Authentication credentials were not provided"**

- Token expired or missing
- Login again to get new token

**"CORS error"**

- Make sure Django server is running on port 8000
- Check CORS settings in `settings.py`

**Posts not showing**

- Check Django server is running
- Check browser console for errors
- Verify API URL is `http://127.0.0.1:8000/api`

**Can't create post**

- Make sure you're logged in
- Check token exists in localStorage
- Check browser console for errors

## 📦 File Structure

```
Blog/
├── HomeApp/
│   ├── models.py          # Post model
│   ├── serializers.py     # PostSerializer
│   ├── views.py           # PostViewSet
│   └── urls.py            # API routes
├── Accounts/
│   ├── api_views.py       # signup, login, current_user
│   └── urls.py            # Auth routes
└── Blog/
    ├── settings.py        # JWT config
    └── urls.py            # Main URL config

blog-frontend/
└── src/
    ├── HomePage.js        # Main component (JWT version)
    └── HomePage.css       # Styles
```

## 🚀 You're All Set!

Your blog is ready with:

- ✅ Simple user authentication (username + password)
- ✅ JWT tokens for security
- ✅ Create posts (logged-in users only)
- ✅ View all posts (everyone)
- ✅ Click to view post details
- ✅ Delete own posts

Enjoy your blog! 🎉
