import React, { useState, useEffect } from "react";
import "./HomePage.css";

const API_URL = "http://127.0.0.1:8000/api";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [authForm, setAuthForm] = useState({ username: "", password: "" });
  const [createForm, setCreateForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setCurrentUser(JSON.parse(user));
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts/`);
      const data = await response.json();
      setPosts(data.results || data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = authMode === "login" ? "login" : "signup";

    try {
      const response = await fetch(`${API_URL}/auth/${endpoint}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authForm),
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens and user info
        localStorage.setItem("access_token", data.tokens.access);
        localStorage.setItem("refresh_token", data.tokens.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));
        setCurrentUser(data.user);
        setShowAuthModal(false);
        setAuthForm({ username: "", password: "" });
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Auth error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Please login to create a post");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/posts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createForm),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setCreateForm({ title: "", content: "" });
        fetchPosts(); // Refresh posts list
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to create post");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Create post error:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`${API_URL}/posts/${postId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchPosts(); // Refresh posts list
        setSelectedPost(null); // Close detail view if open
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setError("");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Navigation Bar */}
      <nav
        style={{
          backgroundColor: "#667eea",
          padding: "1rem 2rem",
          marginBottom: "2rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{ margin: 0, color: "white", cursor: "pointer" }}
            onClick={() => setSelectedPost(null)}
          >
            📝 Blog App
          </h2>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {currentUser ? (
              <>
                <span style={{ color: "white" }}>
                  Welcome, {currentUser.username}!
                </span>
                <button
                  onClick={() => setShowCreateModal(true)}
                  style={{
                    padding: "0.5rem 1.5rem",
                    backgroundColor: "#48bb78",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Create Post
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "0.5rem 1.5rem",
                    backgroundColor: "transparent",
                    color: "white",
                    border: "2px solid white",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal("login")}
                  style={{
                    padding: "0.5rem 1.5rem",
                    backgroundColor: "white",
                    color: "#667eea",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => openAuthModal("signup")}
                  style={{
                    padding: "0.5rem 1.5rem",
                    backgroundColor: "transparent",
                    color: "white",
                    border: "2px solid white",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div style={{ padding: "0 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {selectedPost ? (
            // Post Detail View
            <div>
              <button
                onClick={() => setSelectedPost(null)}
                style={{
                  marginBottom: "1rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ← Back to All Posts
              </button>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "2rem",
                  borderRadius: "12px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <h1 style={{ marginTop: 0 }}>{selectedPost.title}</h1>
                <p
                  style={{
                    color: "#555",
                    lineHeight: "1.8",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedPost.content}
                </p>
                <div
                  style={{
                    marginTop: "2rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid #e0e0e0",
                  }}
                >
                  <small style={{ color: "#888" }}>
                    Posted on{" "}
                    {new Date(selectedPost.created_at).toLocaleDateString()}
                  </small>
                  <small
                    style={{
                      color: "#667eea",
                      fontWeight: "600",
                      marginLeft: "1rem",
                    }}
                  >
                    By: {selectedPost.author_name}
                  </small>
                  {currentUser && currentUser.id === selectedPost.author && (
                    <button
                      onClick={() => handleDeletePost(selectedPost.id)}
                      style={{
                        marginLeft: "1rem",
                        padding: "0.5rem 1rem",
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Posts List View
            <>
              <h1 style={{ margin: "0 0 2rem 0", color: "#333" }}>All Posts</h1>
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    style={{
                      backgroundColor: "#fff",
                      padding: "2rem",
                      marginBottom: "1.5rem",
                      border: "1px solid #e0e0e0",
                      borderRadius: "12px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0,0,0,0.1)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 2px 4px rgba(0,0,0,0.05)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <h2
                      style={{ marginTop: 0, color: "#333", fontSize: "24px" }}
                    >
                      {post.title}
                    </h2>
                    <p
                      style={{
                        color: "#555",
                        lineHeight: "1.6",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {post.content}
                    </p>
                    <div style={{ marginTop: "1rem" }}>
                      <small style={{ color: "#888" }}>
                        {new Date(post.created_at).toLocaleDateString()}
                      </small>
                      <small
                        style={{
                          color: "#667eea",
                          fontWeight: "600",
                          marginLeft: "1rem",
                        }}
                      >
                        By: {post.author_name}
                      </small>
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
                  <p style={{ color: "#888" }}>
                    No posts yet. Be the first to create one!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowAuthModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "400px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0 }}>
              {authMode === "login" ? "Login" : "Sign Up"}
            </h2>
            {error && (
              <div
                style={{
                  padding: "0.75rem",
                  backgroundColor: "#fee",
                  color: "#c00",
                  borderRadius: "6px",
                  marginBottom: "1rem",
                }}
              >
                {error}
              </div>
            )}
            <form onSubmit={handleAuth}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Username
                </label>
                <input
                  type="text"
                  value={authForm.username}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, username: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Password
                </label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, password: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                  required
                />
              </div>
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {authMode === "login" ? "Login" : "Sign Up"}
              </button>
            </form>
            <p
              style={{ marginTop: "1rem", textAlign: "center", color: "#666" }}
            >
              {authMode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <span
                onClick={() =>
                  setAuthMode(authMode === "login" ? "signup" : "login")
                }
                style={{
                  color: "#667eea",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {authMode === "login" ? "Sign Up" : "Login"}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "600px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0 }}>Create New Post</h2>
            {error && (
              <div
                style={{
                  padding: "0.75rem",
                  backgroundColor: "#fee",
                  color: "#c00",
                  borderRadius: "6px",
                  marginBottom: "1rem",
                }}
              >
                {error}
              </div>
            )}
            <form onSubmit={handleCreatePost}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Title
                </label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, title: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Content
                </label>
                <textarea
                  value={createForm.content}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, content: e.target.value })
                  }
                  rows="6"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px",
                    resize: "vertical",
                  }}
                  required
                />
              </div>
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "#48bb78",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Create Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
