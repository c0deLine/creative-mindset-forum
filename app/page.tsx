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
          "content-type": "application/json",
        },
        body: JSON.stringify({
          author,
          title,
          content,
        }),
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
      method: "DELETE",
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
        background:
          "radial-gradient(circle at top left, #1d4ed8 0%, #0f172a 35%, #020617 100%)",
        color: "#e5e7eb",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: "32px 20px 64px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "24px",
            alignItems: "stretch",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "24px",
              padding: "32px",
              backdropFilter: "blur(12px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: "999px",
                background: "rgba(96,165,250,0.18)",
                border: "1px solid rgba(147,197,253,0.25)",
                color: "#bfdbfe",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "18px",
              }}
            >
              AWS Serverless Forum
            </div>

            <h1
              style={{
                margin: "0 0 14px 0",
                fontSize: "3rem",
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                color: "#ffffff",
              }}
            >
              Creative Mindset
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: "1.08rem",
                lineHeight: 1.7,
                color: "#cbd5e1",
                maxWidth: "650px",
              }}
            >
              A modern community board powered by Next.js, API Gateway, Lambda,
              and S3. Share ideas, post updates, and keep the conversation
              flowing with a clean, lightweight serverless app.
            </p>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.22), rgba(168,85,247,0.16))",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "24px",
              padding: "28px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "18px",
                color: "#ffffff",
                fontSize: "1.3rem",
              }}
            >
              Quick Stats
            </h2>

            <div
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  borderRadius: "18px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ color: "#93c5fd", fontSize: "0.9rem" }}>
                  Total Posts
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    marginTop: "6px",
                    color: "#ffffff",
                  }}
                >
                  {posts.length}
                </div>
              </div>

              <div
                style={{
                  padding: "16px",
                  borderRadius: "18px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ color: "#c4b5fd", fontSize: "0.9rem" }}>
                  Latest Activity
                </div>
                <div
                  style={{
                    fontSize: "0.98rem",
                    marginTop: "8px",
                    color: "#e2e8f0",
                    lineHeight: 1.5,
                  }}
                >
                  {posts.length > 0
                    ? new Date(posts[0].createdAt).toLocaleString()
                    : "No posts yet"}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "24px",
            padding: "28px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "8px",
              color: "#ffffff",
              fontSize: "1.5rem",
            }}
          >
            Create a Post
          </h2>
          <p
            style={{
              marginTop: 0,
              marginBottom: "22px",
              color: "#cbd5e1",
            }}
          >
            Share an idea, insight, or question with the community.
          </p>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
                marginBottom: "14px",
              }}
            >
              <input
                type="text"
                placeholder="Your name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(15,23,42,0.7)",
                  color: "#ffffff",
                  outline: "none",
                  fontSize: "0.98rem",
                }}
              />

              <input
                type="text"
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(15,23,42,0.7)",
                  color: "#ffffff",
                  outline: "none",
                  fontSize: "0.98rem",
                }}
              />
            </div>

            <textarea
              placeholder="Write your post here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{
                width: "100%",
                minHeight: "150px",
                padding: "16px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(15,23,42,0.7)",
                color: "#ffffff",
                outline: "none",
                resize: "vertical",
                fontSize: "1rem",
                lineHeight: 1.6,
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                marginTop: "18px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "13px 22px",
                  borderRadius: "14px",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.96rem",
                  boxShadow: "0 12px 30px rgba(37,99,235,0.35)",
                }}
              >
                {loading ? "Posting..." : "Publish Post"}
              </button>

              {status ? (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.08)",
                    color: "#e2e8f0",
                    fontSize: "0.95rem",
                  }}
                >
                  {status}
                </div>
              ) : null}
            </div>
          </form>
        </section>

        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              marginBottom: "18px",
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: "1.6rem",
              }}
            >
              Forum Posts
            </h2>

            <div
              style={{
                color: "#cbd5e1",
                fontSize: "0.95rem",
              }}
            >
              Showing newest posts first
            </div>
          </div>

          {posts.length === 0 ? (
            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "24px",
                padding: "28px",
                color: "#cbd5e1",
              }}
            >
              No posts yet. Be the first to start the conversation.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "18px",
              }}
            >
              {posts.map((post) => (
                <article
                  key={post.id}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "24px",
                    padding: "22px",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.22)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "18px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: "250px" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                          flexWrap: "wrap",
                          marginBottom: "8px",
                        }}
                      >
                        <span
                          style={{
                            padding: "5px 10px",
                            borderRadius: "999px",
                            background: "rgba(96,165,250,0.16)",
                            color: "#bfdbfe",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                          }}
                        >
                          {post.author || "Anonymous"}
                        </span>
                        <span
                          style={{
                            color: "#94a3b8",
                            fontSize: "0.85rem",
                          }}
                        >
                          {new Date(post.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <h3
                        style={{
                          margin: "0 0 10px 0",
                          color: "#ffffff",
                          fontSize: "1.3rem",
                        }}
                      >
                        {post.title}
                      </h3>

                      <p
                        style={{
                          margin: 0,
                          color: "#dbeafe",
                          lineHeight: 1.75,
                          whiteSpace: "pre-wrap",
                          fontSize: "1rem",
                        }}
                      >
                        {post.content}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(post.id)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "12px",
                        border: "1px solid rgba(248,113,113,0.45)",
                        background: "rgba(127,29,29,0.18)",
                        color: "#fca5a5",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}