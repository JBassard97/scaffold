"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; // Correct way to use routing
import { useState, useEffect } from "react";
import formatDate from "@/lib/formatDate";
import { User } from "@/types";
import { ChangeUsernameForm } from "../components/ChangeUsernameForm/ChangeUsernameForm";
import { ChangeEmailForm } from "../components/ChangeEmailForm/ChangeEmailForm";
import { ChangePasswordForm } from "../components/ChangePasswordForm/ChangePasswordForm";

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const router = useRouter(); // Use useRouter hook

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
      localStorage.setItem("loggedIn", "false");
      router.push("/"); // Redirect to home page if not logged in
    }
  }, [router]); // Include router in the dependency array to avoid issues

  return (
    <div>
      {userData && (
        <div>
          <h2>Your Profile</h2>
          <h3>Username: {userData.username}</h3>
          <ChangeUsernameForm _id={userData._id} setUserData={setUserData} />
          <h3>Email: {userData.email}</h3>
          <ChangeEmailForm _id={userData._id} setUserData={setUserData} />
          <h3>Password: ********</h3>
          <ChangePasswordForm _id={userData._id} />
          <h3>Joined On: {formatDate(userData.createdAt)}</h3>
          {userData.createdAt !== userData.updatedAt && (
            <h3>Profile Updated On: {formatDate(userData.updatedAt)}</h3>
          )}
        </div>
      )}
    </div>
  );
}
