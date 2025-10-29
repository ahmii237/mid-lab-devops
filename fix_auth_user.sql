-- Fix auth_user table to allow NULL for last_login
-- Run this in Neon SQL Editor

ALTER TABLE auth_user ALTER COLUMN last_login DROP NOT NULL;
