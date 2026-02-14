"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Toast from "./component/Toast";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  user_id: string;
}

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // ------------------ Fetch Bookmarks ------------------
  const fetchBookmarks = async (userId: string) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) setBookmarks(data);
  };

  // ------------------ Google Auth ------------------
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) fetchBookmarks(session.user.id);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) fetchBookmarks(newSession.user.id);
      else setBookmarks([]);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setBookmarks([]);
    setToast({ message: "Logged out successfully", type: "success" });
  };

  // ------------------ Add/Delete Bookmarks ------------------
  const addBookmark = async () => {
    if (!title || !url || !session) return;

    const { error } = await supabase.from("bookmarks").insert([
      { title, url, user_id: session.user.id },
    ]);

    if (error) setToast({ message: "Failed to add bookmark!", type: "error" });
    else {
      setToast({ message: "Bookmark added!", type: "success" });
      setTitle("");
      setUrl("");
      fetchBookmarks(session.user.id);
    }
  };

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (error) setToast({ message: "Failed to delete bookmark!", type: "error" });
    else {
      setToast({ message: "Bookmark deleted!", type: "success" });
      if (session) fetchBookmarks(session.user.id);
    }
  };

  // ------------------ Auto-hide Toast ------------------
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  // ------------------ Login Screen ------------------
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Smart Bookmark App</h1>
        <button
          onClick={loginWithGoogle}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Sign in with Google
        </button>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
    );
  }

  // ------------------ Main App ------------------
  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Bookmarks</h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Add Bookmark</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 p-2 border border-gray-400 rounded text-black"
          />
          <input
            type="url"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 p-2 border border-gray-400 rounded text-black"
          />
          <button
            onClick={addBookmark}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>
      </div>

      <ul className="space-y-2">
        {bookmarks.map((bookmark) => (
          <li
            key={bookmark.id}
            className="flex justify-between items-center p-3 bg-white rounded shadow"
          >
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 hover:text-blue-700 font-medium underline"
            >
              {bookmark.title}
            </a>
            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 ml-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}