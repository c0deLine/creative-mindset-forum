"use client";

import { useEffect, useState } from "react";

type Post = {
  id: string;
  author?: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadPosts() {
    try {
      const res = await fetch("/api/posts", { cache: "no-store" });
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setStatus("Failed to load posts.");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          author,
          title,
          content
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || "Failed to create post.");
        return;
      }

      setStatus("Post created successfully.");
      setAuthor("");
      setTitle("");
      setContent("");
      await loadPosts();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this post?");
    if (!confirmed) return;

    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus(data.error || "Failed to delete post.");
      return;
    }

    setStatus("Post deleted.");
    await loadPosts();
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
        color: "#1f2937"
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto"
        }}
      >
        <header
          style={{
            marginBottom: "32px",
            textAlign: "center"
          }}
        >
          <h1 style={{ fontSize: "2.4rem", marginBottom: "8px" }}>
            Creative Mindset Forum
          </h1>
          <p style={{ color: "#4b5563", margin: 0 }}>
            A simple AWS-hosted forum built with Next.js, API Gateway, Lambda, and S3.
          </p>
        </header>

        <section
          style={{
            background: "#ffffff",
            borderRadius: "14px",
            padding: "24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            marginBottom: "32px"
          }}
        >
          <h2 style={{ marginTop: 0 }}>Create a Post</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Your name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db"
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db"
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <textarea
                placeholder="Write your post here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  minHeight: "140px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  resize: "vertical"
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px 20px",
                borderRadius: "8px",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              {loading ? "Posting..." : "Create Post"}
            </button>
          </form>

          {status ? (
            <p style={{ marginTop: "14px", color: "#374151" }}>{status}</p>
          ) : null}
        </section>

        <section>
          <h2>Forum Posts</h2>

          {posts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                style={{
                  background: "#ffffff",
                  borderRadius: "14px",
                  padding: "20px",
                  marginBottom: "18px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "flex-start"
                  }}
                >
                  <div>
                    <h3 style={{ marginTop: 0, marginBottom: "8px" }}>{post.title}</h3>
                    <p style={{ marginTop: 0, marginBottom: "12px", whiteSpace: "pre-wrap" }}>
                      {post.content}
                    </p>
                    <small style={{ color: "#6b7280" }}>
                      By {post.author || "Anonymous"} •{" "}
                      {new Date(post.createdAt).toLocaleString()}
                    </small>
                  </div>

                  <button
                    onClick={() => handleDelete(post.id)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #ef4444",
                      background: "#fff",
                      color: "#ef4444",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}