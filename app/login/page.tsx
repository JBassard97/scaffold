"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Set loggedIn state to true in localStorage
      localStorage.setItem("loggedIn", "true");

      // Store JWT token in localStorage
      localStorage.setItem("token", data.token);

      // Store user data if needed
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to /profile
      window.location.href = "/profile";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="">
      <div className="">
        <h1 className="">Login</h1>

        {error && <div className="">{error}</div>}

        <form onSubmit={handleSubmit} className="">
          <div>
            <label htmlFor="email" className="">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className=""
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className=""
              required
            />
          </div>

          <button type="submit" disabled={loading} className="">
            {loading ? "Logging in..." : "Login"}
          </button>
          <Link href="/register">Not a Member? Register!</Link>
        </form>
      </div>
    </div>
  );
}
