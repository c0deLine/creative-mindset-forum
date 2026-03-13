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
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.28),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_25%),linear-gradient(to_bottom,_#0f172a,_#020617)]" />

      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-lg font-semibold tracking-tight text-white">
              Creative Mindset
            </div>
            <div className="text-sm text-slate-400">Serverless Community Forum</div>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
            {posts.length} post{posts.length === 1 ? "" : "s"}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-white/10 bg-white/8 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-sm font-medium text-blue-200">
              AWS • Next.js • Lambda • S3
            </div>

            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Build ideas.
              <br />
              Share momentum.
            </h1>

            <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              A modern, serverless discussion board powered by AWS. Post ideas,
              share updates, and keep a lightweight community space running on
              Next.js, API Gateway, Lambda, and S3.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-violet-500/10 p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="mb-5 text-xl font-semibold text-white">Overview</h2>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/8 bg-white/6 p-4">
                <div className="text-sm text-slate-400">Total posts</div>
                <div className="mt-1 text-3xl font-bold text-white">{posts.length}</div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/6 p-4">
                <div className="text-sm text-slate-400">Latest activity</div>
                <div className="mt-2 text-sm leading-6 text-slate-200">
                  {posts.length > 0
                    ? new Date(posts[0].createdAt).toLocaleString()
                    : "No activity yet"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/6 p-4">
                <div className="text-sm text-slate-400">Stack</div>
                <div className="mt-2 text-sm leading-6 text-slate-200">
                  Amplify Hosting, API Gateway, Lambda, and Amazon S3.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10 rounded-3xl border border-white/10 bg-white/8 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">Create a Post</h2>
            <p className="mt-2 text-slate-400">
              Share a thought, insight, or question with the forum.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Your name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/20"
              />

              <input
                type="text"
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <textarea
              placeholder="Write your post here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="min-h-[160px] w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-4 text-white outline-none transition focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/20"
            />

            <div className="flex flex-col gap-3 pt-2 md:flex-row md:items-center md:justify-between">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:scale-[1.01] hover:from-blue-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Posting..." : "Publish Post"}
              </button>

              {status ? (
                <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-200">
                  {status}
                </div>
              ) : null}
            </div>
          </form>
        </section>

        <section>
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Forum Posts</h2>
              <p className="mt-1 text-slate-400">Newest posts appear first.</p>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-300">
              <div className="mb-2 text-xl font-medium text-white">No posts yet</div>
              <p className="text-sm text-slate-400">
                Be the first to start the conversation.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group rounded-3xl border border-white/10 bg-white/8 p-6 shadow-xl backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-200">
                          {post.author || "Anonymous"}
                        </span>
                        <span className="text-sm text-slate-400">
                          {new Date(post.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <h3 className="mb-3 text-2xl font-semibold tracking-tight text-white">
                        {post.title}
                      </h3>

                      <p className="whitespace-pre-wrap text-[15px] leading-7 text-slate-200">
                        {post.content}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(post.id)}
                      className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:border-red-300/40 hover:bg-red-500/20"
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