// pages/index.tsx

"use client";

import Link from "next/link";
// import { isLoggedIn } from "../lib/auth";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check the logged-in state from localStorage on page load
    const storedLoggedIn = localStorage.getItem("loggedIn");
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // If storedLoggedIn is true, set the loggedIn state accordingly
    if (storedLoggedIn === "true" && token && user) {
      setLoggedIn(true);
      setUserData(JSON.parse(user));
      console.log("User data:", JSON.parse(user));
    } else {
      setLoggedIn(false);
    }
  }, []); // Empty dependency array ensures this only runs once on page load

  const handleLogout = () => {
    // If the user logs out, remove loggedIn state from localStorage
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
  };

  return (
    <div>
      {loggedIn ? (
        <>
          <h1>Logged In</h1>
          <button onClick={handleLogout}>Logout</button>
          <Link href="/profile">Profile</Link>
        </>
      ) : (
        <div>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      )}
    </div>
  );
}
