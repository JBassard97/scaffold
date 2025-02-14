import React, { useState, Dispatch, SetStateAction } from "react";
import { User } from "@/types";

interface ChangeUsernameFormProps {
  _id: string;
  setUserData: Dispatch<SetStateAction<User | null>>;
}

export const ChangeUsernameForm = ({
  _id,
  setUserData,
}: ChangeUsernameFormProps) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/users/update/username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id, newUsername: username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update username");
      }

      setUsername(""); // Clear the input field
      setUserData(data.user); // Update the user data
      localStorage.setItem("user", JSON.stringify(data.user)); // Update the user data in localStorage

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={handleChange}
        placeholder="New username"
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Change username"}
      </button>
      {error && <p>{error}</p>}
      {success && <p>Username updated successfully!</p>}
    </form>
  );
};
