-- ============================================
-- Neon Database Setup SQL Script
-- Blog Django React PostgreSQL Project
-- ============================================

-- Drop existing tables if they exist (be careful with this in production!)
DROP TABLE IF EXISTS "HomeApp_comment" CASCADE;
DROP TABLE IF EXISTS "HomeApp_post" CASCADE;
DROP TABLE IF EXISTS "auth_user" CASCADE;
DROP TABLE IF EXISTS "django_migrations" CASCADE;
DROP TABLE IF EXISTS "django_content_type" CASCADE;
DROP TABLE IF EXISTS "auth_permission" CASCADE;
DROP TABLE IF EXISTS "auth_group" CASCADE;
DROP TABLE IF EXISTS "auth_group_permissions" CASCADE;
DROP TABLE IF EXISTS "auth_user_groups" CASCADE;
DROP TABLE IF EXISTS "auth_user_user_permissions" CASCADE;
DROP TABLE IF EXISTS "django_admin_log" CASCADE;
DROP TABLE IF EXISTS "django_session" CASCADE;

-- ============================================
-- 1. Create Django System Tables
-- ============================================

-- Django Migrations Table
CREATE TABLE "django_migrations" (
    "id" BIGSERIAL PRIMARY KEY,
    "app" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "applied" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Django Content Types
CREATE TABLE "django_content_type" (
    "id" SERIAL PRIMARY KEY,
    "app_label" VARCHAR(100) NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    UNIQUE ("app_label", "model")
);

-- ============================================
-- 2. Create Authentication Tables
-- ============================================

-- Auth User Table
CREATE TABLE "auth_user" (
    "id" SERIAL PRIMARY KEY,
    "password" VARCHAR(128) NOT NULL,
    "last_login" TIMESTAMP WITH TIME ZONE,
    "is_superuser" BOOLEAN NOT NULL,
    "username" VARCHAR(150) NOT NULL UNIQUE,
    "first_name" VARCHAR(150) NOT NULL,
    "last_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "is_staff" BOOLEAN NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "date_joined" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Auth Group
CREATE TABLE "auth_group" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(150) NOT NULL UNIQUE
);

-- Auth Permission
CREATE TABLE "auth_permission" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "content_type_id" INTEGER NOT NULL REFERENCES "django_content_type" ("id") DEFERRABLE INITIALLY DEFERRED,
    "codename" VARCHAR(100) NOT NULL,
    UNIQUE ("content_type_id", "codename")
);

-- Auth Group Permissions
CREATE TABLE "auth_group_permissions" (
    "id" BIGSERIAL PRIMARY KEY,
    "group_id" INTEGER NOT NULL REFERENCES "auth_group" ("id") DEFERRABLE INITIALLY DEFERRED,
    "permission_id" INTEGER NOT NULL REFERENCES "auth_permission" ("id") DEFERRABLE INITIALLY DEFERRED,
    UNIQUE ("group_id", "permission_id")
);

-- Auth User Groups
CREATE TABLE "auth_user_groups" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL REFERENCES "auth_user" ("id") DEFERRABLE INITIALLY DEFERRED,
    "group_id" INTEGER NOT NULL REFERENCES "auth_group" ("id") DEFERRABLE INITIALLY DEFERRED,
    UNIQUE ("user_id", "group_id")
);

-- Auth User Permissions
CREATE TABLE "auth_user_user_permissions" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL REFERENCES "auth_user" ("id") DEFERRABLE INITIALLY DEFERRED,
    "permission_id" INTEGER NOT NULL REFERENCES "auth_permission" ("id") DEFERRABLE INITIALLY DEFERRED,
    UNIQUE ("user_id", "permission_id")
);

-- Django Admin Log
CREATE TABLE "django_admin_log" (
    "id" SERIAL PRIMARY KEY,
    "action_time" TIMESTAMP WITH TIME ZONE NOT NULL,
    "object_id" TEXT,
    "object_repr" VARCHAR(200) NOT NULL,
    "action_flag" SMALLINT NOT NULL CHECK ("action_flag" >= 0),
    "change_message" TEXT NOT NULL,
    "content_type_id" INTEGER REFERENCES "django_content_type" ("id") DEFERRABLE INITIALLY DEFERRED,
    "user_id" INTEGER NOT NULL REFERENCES "auth_user" ("id") DEFERRABLE INITIALLY DEFERRED
);

-- Django Session
CREATE TABLE "django_session" (
    "session_key" VARCHAR(40) PRIMARY KEY,
    "session_data" TEXT NOT NULL,
    "expire_date" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================
-- 3. Create Blog Application Tables
-- ============================================

-- HomeApp Post Table
CREATE TABLE "HomeApp_post" (
    "id" BIGSERIAL PRIMARY KEY,
    "title" VARCHAR(300) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL,
    "author_id" INTEGER NOT NULL REFERENCES "auth_user" ("id") DEFERRABLE INITIALLY DEFERRED
);

-- HomeApp Comment Table
CREATE TABLE "HomeApp_comment" (
    "id" BIGSERIAL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "author_id" INTEGER NOT NULL REFERENCES "auth_user" ("id") DEFERRABLE INITIALLY DEFERRED,
    "post_id" BIGINT NOT NULL REFERENCES "HomeApp_post" ("id") DEFERRABLE INITIALLY DEFERRED
);

-- ============================================
-- 4. Create Indexes for Better Performance
-- ============================================

CREATE INDEX "auth_permission_content_type_id_idx" ON "auth_permission" ("content_type_id");
CREATE INDEX "auth_group_permissions_group_id_idx" ON "auth_group_permissions" ("group_id");
CREATE INDEX "auth_group_permissions_permission_id_idx" ON "auth_group_permissions" ("permission_id");
CREATE INDEX "auth_user_groups_user_id_idx" ON "auth_user_groups" ("user_id");
CREATE INDEX "auth_user_groups_group_id_idx" ON "auth_user_groups" ("group_id");
CREATE INDEX "auth_user_user_permissions_user_id_idx" ON "auth_user_user_permissions" ("user_id");
CREATE INDEX "auth_user_user_permissions_permission_id_idx" ON "auth_user_user_permissions" ("permission_id");
CREATE INDEX "django_admin_log_content_type_id_idx" ON "django_admin_log" ("content_type_id");
CREATE INDEX "django_admin_log_user_id_idx" ON "django_admin_log" ("user_id");
CREATE INDEX "django_session_expire_date_idx" ON "django_session" ("expire_date");
CREATE INDEX "HomeApp_post_author_id_idx" ON "HomeApp_post" ("author_id");
CREATE INDEX "HomeApp_comment_author_id_idx" ON "HomeApp_comment" ("author_id");
CREATE INDEX "HomeApp_comment_post_id_idx" ON "HomeApp_comment" ("post_id");

-- ============================================
-- 5. Insert Sample Data
-- ============================================

-- Insert a test user (password is 'password123' - hashed with PBKDF2)
INSERT INTO "auth_user" (
    "password", 
    "last_login", 
    "is_superuser", 
    "username", 
    "first_name", 
    "last_name", 
    "email", 
    "is_staff", 
    "is_active", 
    "date_joined"
) VALUES 
(
    'pbkdf2_sha256$600000$salt123456789012$HASH',  -- This is a placeholder, use Django's createsuperuser command for real password
    NOW(), 
    true, 
    'admin', 
    'Admin', 
    'User', 
    'admin@example.com', 
    true, 
    true, 
    NOW()
),
(
    'pbkdf2_sha256$600000$salt123456789012$HASH',
    NOW(), 
    false, 
    'john_doe', 
    'John', 
    'Doe', 
    'john@example.com', 
    false, 
    true, 
    NOW()
),
(
    'pbkdf2_sha256$600000$salt123456789012$HASH',
    NOW(), 
    false, 
    'jane_smith', 
    'Jane', 
    'Smith', 
    'jane@example.com', 
    false, 
    true, 
    NOW()
);

-- Insert Sample Blog Posts
INSERT INTO "HomeApp_post" ("title", "content", "created_at", "updated_on", "author_id") VALUES
(
    'Getting Started with Django and React',
    'Django and React are two powerful frameworks that work great together. Django provides a robust backend with its REST framework, while React creates dynamic and interactive user interfaces.

In this tutorial, we will explore how to build a full-stack blog application using Django for the backend API and React for the frontend. We''ll cover authentication, CRUD operations, and deployment strategies.

Stay tuned for more updates!',
    NOW() - INTERVAL ''10 days'',
    NOW() - INTERVAL ''10 days'',
    1
),
(
    'Understanding PostgreSQL and Neon Database',
    'PostgreSQL is one of the most advanced open-source relational databases. Neon takes it to the next level by providing serverless PostgreSQL with features like:

- Instant database creation
- Automatic scaling
- Branching for development
- Easy integration with modern frameworks

Whether you''re building a small project or a large-scale application, Neon makes database management simple and efficient.',
    NOW() - INTERVAL ''7 days'',
    NOW() - INTERVAL ''7 days'',
    2
),
(
    'RESTful API Design Best Practices',
    'When building APIs with Django REST Framework, following best practices is crucial for maintainability and scalability. Here are some key principles:

1. Use proper HTTP methods (GET, POST, PUT, DELETE)
2. Implement pagination for large datasets
3. Add proper authentication and permissions
4. Use serializers for data validation
5. Document your API with tools like Swagger

Remember, a well-designed API is the foundation of any successful application!',
    NOW() - INTERVAL ''5 days'',
    NOW() - INTERVAL ''5 days'',
    1
),
(
    'React Hooks: A Complete Guide',
    'React Hooks revolutionized the way we write React components. Instead of class components, we can now use functional components with state and lifecycle features.

Common hooks include:
- useState: For managing component state
- useEffect: For side effects and lifecycle methods
- useContext: For accessing context
- useReducer: For complex state management

Hooks make your code cleaner, more reusable, and easier to test. If you haven''t started using them yet, now is the time!',
    NOW() - INTERVAL ''3 days'',
    NOW() - INTERVAL ''3 days'',
    3
),
(
    'Building a Blog with Django REST Framework',
    'In this comprehensive guide, we''ll build a complete blog application using Django REST Framework. We''ll cover:

- Setting up models for Posts and Comments
- Creating serializers for data transformation
- Building ViewSets for CRUD operations
- Implementing authentication with tokens
- Adding CORS support for React frontend

This project demonstrates real-world patterns you can apply to any Django project. The source code includes best practices for security, performance, and maintainability.',
    NOW() - INTERVAL ''2 days'',
    NOW() - INTERVAL ''2 days'',
    2
),
(
    'Deploying Full-Stack Applications',
    'Deploying a full-stack application involves several steps:

Backend (Django):
- Set up a production server (e.g., Heroku, AWS, DigitalOcean)
- Configure environment variables
- Set up PostgreSQL database
- Configure static files and media handling

Frontend (React):
- Build the production bundle
- Deploy to Netlify, Vercel, or similar service
- Configure API endpoints

Don''t forget to set DEBUG=False in production and use proper secret key management!',
    NOW() - INTERVAL ''1 day'',
    NOW() - INTERVAL ''1 day'',
    1
),
(
    'JavaScript ES6+ Features You Should Know',
    'Modern JavaScript has evolved significantly. Here are essential ES6+ features:

1. Arrow Functions: Concise syntax for functions
2. Destructuring: Extract values from objects/arrays
3. Spread Operator: Copy and merge arrays/objects
4. Template Literals: String interpolation
5. Async/Await: Handle asynchronous operations
6. Modules: Import/export functionality

These features make your code more readable and maintainable. Master them to become a better JavaScript developer!',
    NOW() - INTERVAL ''12 hours'',
    NOW() - INTERVAL ''12 hours'',
    3
),
(
    'Database Optimization Tips',
    'Optimizing database queries is crucial for application performance. Here are some tips:

1. Use indexes on frequently queried fields
2. Avoid N+1 queries with select_related and prefetch_related
3. Use database-level constraints
4. Implement proper caching strategies
5. Monitor slow queries and optimize them

A well-optimized database can handle thousands of requests per second. Always profile your queries before deploying to production!',
    NOW() - INTERVAL ''6 hours'',
    NOW() - INTERVAL ''6 hours'',
    2
);

-- Insert Sample Comments
INSERT INTO "HomeApp_comment" ("content", "created_at", "author_id", "post_id") VALUES
(
    'Great tutorial! This really helped me understand how Django and React work together.',
    NOW() - INTERVAL ''9 days'',
    2,
    1
),
(
    'Thanks for sharing. Looking forward to more posts like this!',
    NOW() - INTERVAL ''8 days'',
    3,
    1
),
(
    'I''ve been using Neon for a few months now and it''s amazing. Highly recommend!',
    NOW() - INTERVAL ''6 days'',
    1,
    2
),
(
    'Very informative post about API design. Will implement these practices in my next project.',
    NOW() - INTERVAL ''4 days'',
    3,
    3
),
(
    'Hooks are game-changers! I can''t imagine going back to class components.',
    NOW() - INTERVAL ''2 days'',
    1,
    4
),
(
    'This is exactly what I was looking for. Step-by-step guide to building a blog!',
    NOW() - INTERVAL ''1 day'',
    3,
    5
),
(
    'Deployment can be tricky. Thanks for breaking it down so clearly.',
    NOW() - INTERVAL ''12 hours'',
    2,
    6
),
(
    'ES6+ features have made JavaScript so much more enjoyable to write.',
    NOW() - INTERVAL ''6 hours'',
    1,
    7
),
(
    'Database optimization is often overlooked. Thanks for the reminder!',
    NOW() - INTERVAL ''3 hours'',
    3,
    8
);

-- Insert Django Content Types
INSERT INTO "django_content_type" ("app_label", "model") VALUES
('admin', 'logentry'),
('auth', 'permission'),
('auth', 'group'),
('auth', 'user'),
('contenttypes', 'contenttype'),
('sessions', 'session'),
('HomeApp', 'post'),
('HomeApp', 'comment');

-- ============================================
-- 6. Verify Data
-- ============================================

-- Check if tables were created
SELECT 'Tables created successfully!' as status;

-- Count records
SELECT 
    (SELECT COUNT(*) FROM "auth_user") as users,
    (SELECT COUNT(*) FROM "HomeApp_post") as posts,
    (SELECT COUNT(*) FROM "HomeApp_comment") as comments;

-- Show all posts with author names
SELECT 
    p.id,
    p.title,
    u.username as author,
    p.created_at,
    (SELECT COUNT(*) FROM "HomeApp_comment" c WHERE c.post_id = p.id) as comment_count
FROM "HomeApp_post" p
JOIN "auth_user" u ON p.author_id = u.id
ORDER BY p.created_at DESC;

-- ============================================
-- IMPORTANT NOTES:
-- ============================================
-- 1. The user passwords in this script are placeholders
-- 2. After running this script, use Django's createsuperuser command to create a real admin user
-- 3. Or update the password hash using Django: python manage.py shell
--    >>> from django.contrib.auth.models import User
--    >>> user = User.objects.get(username='admin')
--    >>> user.set_password('your_password_here')
--    >>> user.save()
-- 4. This script is for development/testing. In production, use Django migrations
-- ============================================
