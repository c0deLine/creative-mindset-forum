"use client";

import { useEffect, useState } from "react";

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");

  async function loadPosts() {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_POSTS_URL || "");
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

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
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
    setTitle("");
    setContent("");
    await loadPosts();
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <h1>Creative Mindset Forum</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "40px" }}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "10px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <textarea
            placeholder="Write your post here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: "100%", padding: "10px", minHeight: "120px" }}
            required
          />
        </div>

        <button type="submit" style={{ padding: "10px 20px" }}>
          Create Post
        </button>
      </form>

      {status ? <p>{status}</p> : null}

      <h2>Forum Posts</h2>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <article
            key={post.id}
            style={{
              border: "1px solid #ccc",
              padding: "16px",
              marginBottom: "16px",
              borderRadius: "8px"
            }}
          >
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <small>{new Date(post.createdAt).toLocaleString()}</small>
          </article>
        ))
      )}
    </main>
  );
}