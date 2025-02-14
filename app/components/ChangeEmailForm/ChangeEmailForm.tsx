import React, { useState, Dispatch, SetStateAction } from "react";
import { User } from "@/types";

interface ChangeEmailFormProps {
  _id: string;
  setUserData: Dispatch<SetStateAction<User | null>>;
}

export const ChangeEmailForm = ({ _id, setUserData }: ChangeEmailFormProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/users/update/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id, newEmail: email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update email");
      }

      setEmail(""); // Clear the input field
      setUserData(data.user); // Update the user data
      localStorage.setItem("user", JSON.stringify(data.user)); // Update localStorage

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
        type="email"
        value={email}
        onChange={handleChange}
        placeholder="New email"
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Change email"}
      </button>
      {error && <p>{error}</p>}
      {success && <p>Email updated successfully!</p>}
    </form>
  );
};
