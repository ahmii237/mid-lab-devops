import React, { useEffect, useState } from "react";
import "./HomePage.css";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/current-user/", {
        credentials: "include",
      });
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        console.log("Logged in as:", user);
      } else {
        console.log("Not logged in");
      }
    } catch (error) {
      console.log("Not authenticated");
    }
  };

  const fetchPosts = () => {
    fetch("http://127.0.0.1:8000/api/posts/", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched posts:", data);
        setPosts(data.results || data);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Please login to create a post!");
      window.location.href = "http://127.0.0.1:8000/accounts/login/";
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/posts/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
        }),
      });

      if (response.ok) {
        setNewPost({ title: "", content: "" });
        setShowModal(false);
        fetchPosts();
        alert("Post created successfully!");
      } else {
        const error = await response.json();
        alert("Error: " + (error.detail || "Failed to create post"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create post. Please login first.");
    } finally {
      setLoading(false);
    }
  };

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const handleDeletePost = async (postId, authorId) => {
    if (!currentUser) {
      alert("Please login to delete posts!");
      return;
    }

    if (currentUser.id !== authorId) {
      alert("You can only delete your own posts!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/posts/${postId}/`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
        }
      );

      if (response.ok || response.status === 204) {
        fetchPosts();
        alert("Post deleted successfully!");
      } else {
        alert("Failed to delete post. You can only delete your own posts.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete post");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Navigation Bar */}
      <nav
        style={{
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          padding: "1rem 2rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, color: "#667eea", fontSize: "24px" }}>
            📝 My Blog
          </h2>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {currentUser ? (
              <>
                <span style={{ color: "#555", fontSize: "14px" }}>
                  Welcome, <strong>{currentUser.username}</strong>
                </span>
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#667eea",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  + New Post
                </button>
                <a
                  href="http://127.0.0.1:8000/accounts/logout/"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "transparent",
                    color: "#667eea",
                    border: "2px solid #667eea",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                >
                  Logout
                </a>
              </>
            ) : (
              <>
                <a
                  href="http://127.0.0.1:8000/accounts/login/"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "transparent",
                    color: "#667eea",
                    border: "2px solid #667eea",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Login
                </a>
                <a
                  href="http://127.0.0.1:8000/accounts/signup/"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#667eea",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      <div style={{ padding: "0 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1 style={{ margin: "0 0 2rem 0", color: "#333" }}>Recent Posts</h1>

          {/* Posts List */}
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                style={{
                  backgroundColor: "#fff",
                  padding: "2rem",
                  marginBottom: "1.5rem",
                  border: "1px solid #e0e0e0",
                  borderRadius: "12px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  transition: "box-shadow 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.1)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(0,0,0,0.05)")
                }
              >
                <h2 style={{ marginTop: 0, color: "#333", fontSize: "24px" }}>
                  {post.title}
                </h2>
                <p
                  style={{
                    color: "#555",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {post.content}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "1rem",
                  }}
                >
                  <div>
                    <small style={{ color: "#888" }}>
                      Posted on {new Date(post.created_at).toLocaleDateString()}
                    </small>
                    {post.author && (
                      <small
                        style={{
                          color: "#667eea",
                          fontWeight: "600",
                          marginLeft: "1rem",
                        }}
                      >
                        By: {post.author_name || `User ${post.author}`}
                      </small>
                    )}
                  </div>
                  {currentUser && currentUser.id === post.author && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#dc2626")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "#ef4444")
                      }
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                backgroundColor: "#fff",
                borderRadius: "12px",
              }}
            >
              <p style={{ fontSize: "18px", color: "#666" }}>
                No posts available yet. Create your first post!
              </p>
            </div>
          )}

          {/* Create Post Modal */}
          {showModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
              onClick={() => setShowModal(false)}
            >
              <div
                style={{
                  backgroundColor: "white",
                  padding: "2rem",
                  borderRadius: "12px",
                  width: "90%",
                  maxWidth: "600px",
                  maxHeight: "90vh",
                  overflow: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 style={{ marginTop: 0, color: "#333" }}>Create New Post</h2>
                <form onSubmit={handleCreatePost}>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "#333",
                        fontWeight: "600",
                      }}
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost({ ...newPost, title: e.target.value })
                      }
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        fontSize: "16px",
                        boxSizing: "border-box",
                      }}
                      placeholder="Enter post title..."
                    />
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "#333",
                        fontWeight: "600",
                      }}
                    >
                      Content
                    </label>
                    <textarea
                      value={newPost.content}
                      onChange={(e) =>
                        setNewPost({ ...newPost, content: e.target.value })
                      }
                      required
                      rows="10"
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        fontSize: "16px",
                        boxSizing: "border-box",
                        fontFamily: "inherit",
                        resize: "vertical",
                      }}
                      placeholder="Write your post content..."
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      style={{
                        padding: "12px 24px",
                        backgroundColor: "#e0e0e0",
                        color: "#333",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        padding: "12px 24px",
                        backgroundColor: loading ? "#ccc" : "#667eea",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: loading ? "not-allowed" : "pointer",
                      }}
                    >
                      {loading ? "Creating..." : "Create Post"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
