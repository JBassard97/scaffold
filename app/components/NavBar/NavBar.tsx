"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem("loggedIn");
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (storedLoggedIn === "true" && token && user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
  };

  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        {loggedIn ? (
          <>
            <li>
              <Link href="/profile">Profile</Link>
            </li>
            <li>
              <Link href="/new_project">New Project</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
