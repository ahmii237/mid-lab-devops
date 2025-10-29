-- SQL Script to Create New Simplified Database Schema
-- Run this in Neon SQL Editor after dropping old tables

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Insert sample users (passwords are hashed with Django's make_password)
-- Password for all sample users: "password123"
INSERT INTO users (username, password) VALUES
('john_doe', 'pbkdf2_sha256$870000$KJH8sdf7sdfsdf$abc123def456'),
('jane_smith', 'pbkdf2_sha256$870000$LKI9teg8tegteg$ghi789jkl012');

-- Insert sample posts
INSERT INTO posts (title, content, author_id) VALUES
('Welcome to My Blog', 'This is my first blog post. I am excited to share my thoughts with you all!', 1),
('Understanding Python', 'Python is a versatile programming language that is great for beginners and experts alike.', 1),
('React Best Practices', 'Here are some best practices when building React applications...', 2),
('Database Design Tips', 'Good database design is crucial for scalable applications.', 2);

-- Verify the data
SELECT * FROM users;
SELECT * FROM posts;
