-- Complete Database Reset and Setup for Django
-- Run this in Neon SQL Editor

-- Step 1: Drop all existing tables
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS auth_user_user_permissions CASCADE;
DROP TABLE IF EXISTS auth_user_groups CASCADE;
DROP TABLE IF EXISTS auth_user CASCADE;
DROP TABLE IF EXISTS auth_permission CASCADE;
DROP TABLE IF EXISTS auth_group_permissions CASCADE;
DROP TABLE IF EXISTS auth_group CASCADE;
DROP TABLE IF EXISTS django_admin_log CASCADE;
DROP TABLE IF EXISTS django_content_type CASCADE;
DROP TABLE IF EXISTS django_migrations CASCADE;
DROP TABLE IF EXISTS django_session CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Step 2: That's it! Let Django create all tables through migrations
-- Django will create the correct schema with proper constraints

-- After running this SQL:
-- 1. Delete the migrations folder: Blog\HomeApp\migrations\*
--    (Keep only __init__.py)
-- 2. Run: python manage.py makemigrations
-- 3. Run: python manage.py migrate
