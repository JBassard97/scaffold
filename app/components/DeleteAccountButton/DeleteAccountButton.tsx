// components/DeleteAccountButton.tsx
import { useState } from "react";

interface DeleteAccountButtonProps {
  userId: string;
  onDeleteSuccess: () => void;
}

export const DeleteAccountButton = ({
  userId,
  onDeleteSuccess,
}: DeleteAccountButtonProps) => {
  const [pressCount, setPressCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleDeleteClick = async () => {
    if (pressCount < 4) {
      setPressCount((prevCount) => prevCount + 1);
    } else {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const response = await fetch(`/api/users/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to delete user");
        }

        setSuccess(true);
        onDeleteSuccess(); // Notify parent component of the successful deletion
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <button onClick={handleDeleteClick} disabled={loading}>
        {loading
          ? "Deleting..."
          : `Press ${5 - pressCount} Times to Delete Account`}
      </button>
      <p>
        * Deleting your account results in the loss of all of your personal data
        and access to paid membership features.
      </p>

      {error && <p>{error}</p>}
      {success && <p>User deleted successfully!</p>}
    </div>
  );
};
