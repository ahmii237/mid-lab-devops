-- SQL Script to Drop All Existing Tables in Neon Database
-- Run this in Neon SQL Editor to clean up the database

-- Drop tables in reverse order of dependencies to avoid foreign key constraints
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

-- Verify all tables are dropped
-- You can run this query to check remaining tables:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';
