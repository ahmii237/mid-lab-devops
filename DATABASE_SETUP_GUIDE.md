# How to Set Up Your Neon Database

## Method 1: Use Django Migrations (RECOMMENDED)

This is the proper Django way and will ensure everything is set up correctly.

### Step 1: Run Migrations

```powershell
cd "c:\Users\mudas\Documents\mid lab\Blog-django-react-postgres\Blog"
python manage.py migrate
```

This will create all necessary tables in your Neon database.

### Step 2: Create a Superuser

```powershell
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### Step 3: Add Sample Data via Django Shell

```powershell
python manage.py shell
```

Then paste this code:

```python
from django.contrib.auth.models import User
from HomeApp.models import Post, Comment
from django.utils import timezone

# Create some users
user1 = User.objects.create_user('john_doe', 'john@example.com', 'password123')
user1.first_name = 'John'
user1.last_name = 'Doe'
user1.save()

user2 = User.objects.create_user('jane_smith', 'jane@example.com', 'password123')
user2.first_name = 'Jane'
user2.last_name = 'Smith'
user2.save()

# Get the admin user (created with createsuperuser)
admin = User.objects.get(username='admin')

# Create sample posts
post1 = Post.objects.create(
    title='Getting Started with Django and React',
    content='Django and React are two powerful frameworks that work great together...',
    author=admin
)

post2 = Post.objects.create(
    title='Understanding PostgreSQL and Neon Database',
    content='PostgreSQL is one of the most advanced open-source relational databases...',
    author=user1
)

post3 = Post.objects.create(
    title='RESTful API Design Best Practices',
    content='When building APIs with Django REST Framework, following best practices is crucial...',
    author=admin
)

post4 = Post.objects.create(
    title='React Hooks: A Complete Guide',
    content='React Hooks revolutionized the way we write React components...',
    author=user2
)

post5 = Post.objects.create(
    title='Building a Blog with Django REST Framework',
    content='In this comprehensive guide, we will build a complete blog application...',
    author=user1
)

# Create some comments
Comment.objects.create(
    post=post1,
    author=user1,
    content='Great tutorial! This really helped me understand how Django and React work together.'
)

Comment.objects.create(
    post=post1,
    author=user2,
    content='Thanks for sharing. Looking forward to more posts like this!'
)

Comment.objects.create(
    post=post2,
    author=admin,
    content='I have been using Neon for a few months now and it is amazing. Highly recommend!'
)

Comment.objects.create(
    post=post3,
    author=user2,
    content='Very informative post about API design. Will implement these practices in my next project.'
)

print("✅ Sample data created successfully!")
print(f"Total Posts: {Post.objects.count()}")
print(f"Total Comments: {Comment.objects.count()}")
print(f"Total Users: {User.objects.count()}")
```

Press Ctrl+Z and Enter (Windows) to exit the shell.

### Step 4: Run the Server

```powershell
python manage.py runserver
```

---

## Method 2: Use SQL Script in Neon Console (Alternative)

If you prefer to use SQL directly:

1. Go to Neon Console: https://console.neon.tech
2. Select your project
3. Click on "SQL Editor"
4. Open the file: `neon_database_setup.sql` (I created this for you)
5. Copy and paste the entire SQL script
6. Click "Run" to execute

**Note:** If you use this method, you'll still need to:

- Run `python manage.py migrate` to create Django's migration records
- Create a superuser with `python manage.py createsuperuser`

---

## Troubleshooting

### "relation does not exist" error

This means tables aren't created. Run: `python manage.py migrate`

### Can't login with sample users

Sample user passwords won't work because they're hashed. Either:

- Use the Django shell method above (uses proper password hashing)
- Or create users via `python manage.py createsuperuser`
- Or login to admin and create users there

### Pagination warning

Add this to your Post model:

```python
class Meta:
    ordering = ['-created_at']
```

---

## Quick Commands Summary

```powershell
# Navigate to project
cd "c:\Users\mudas\Documents\mid lab\Blog-django-react-postgres\Blog"

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Add sample data (use Django shell method above)
python manage.py shell

# Run server
python manage.py runserver
```

---

## Verify Everything Works

1. Server running: http://127.0.0.1:8000
2. Admin panel: http://127.0.0.1:8000/admin
3. API endpoint: http://127.0.0.1:8000/api/posts/
4. React frontend: (run `npm start` in blog-frontend directory)

---

**Recommendation:** Use Method 1 (Django migrations) - it's the proper way and ensures database consistency!
