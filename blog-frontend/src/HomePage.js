import React, { useEffect, useState } from 'react';

const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/posts/')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched posts:', data);
        setPosts(data);
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f5f5f5' }}>
      <h1>Blog Posts</h1>

      {/* Debug: show raw data */}
      {/* <pre>{JSON.stringify(posts, null, 2)}</pre> */}

      {/* Render each post */}
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            backgroundColor: '#fff',
            padding: '1rem',
            marginBottom: '1rem',
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}
        >
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <small>Posted on {new Date(post.created_at).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
