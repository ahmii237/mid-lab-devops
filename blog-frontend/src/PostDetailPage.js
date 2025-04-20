import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PostDetailPage = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/posts/${id}/`)  // Fetch specific post by ID from API
      .then(response => response.json())
      .then(data => {
        setPost(data);  // Update state with the fetched post
      })
      .catch(error => console.error('Error fetching post:', error));
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      {/* Future feature: Display comments */}
    </div>
  );
};

export default PostDetailPage;
