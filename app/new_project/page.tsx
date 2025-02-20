"use client";

export default function NewProjectPage() {
  return (
    <div>
      <p>
        You aboutta pay me a dollar real quick if you haven't already before I
        let you download the scaffold or utilize the CLI I'm working on
      </p>
      <button onClick={() => (window.location.href = "/questionnaire")}>
        Start Questionnaire
      </button>
    </div>
  );
}
