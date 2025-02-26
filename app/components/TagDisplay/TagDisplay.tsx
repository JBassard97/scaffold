"use client";

import React from "react";

interface TagDisplayProps {
  answers: Record<string, string>;
}

const capitalizeFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const langs = ["javascript", "typescript", "python", "java"];

export function TagDisplay({ answers }: TagDisplayProps) {
  const taggifyAnswer = (key: string, value: string) => {
    const startValues = ["frontend", "backend", "full-stack"];
    const frontendFrameworks = ["react", "angular", "vue", "svelte", "vanilla"];
    const backendFrameworks = [
      "express",
      "django",
      "flask",
      "spring",
      "fastapi",
      "spring-boot",
    ];
    const fullStackFrameworks = ["next", "nuxt", "sveltekit", "laravel"];
    let tag = "";

    if (startValues.includes(value)) {
      tag = capitalizeFirst(value);
    } else if (value === "framework") {
      tag = `${capitalizeFirst(key) + " " + capitalizeFirst(value)}`;
    } else if (langs.includes(value) && key.split("-").includes("language")) {
      tag = capitalizeFirst(value);
    } else if (value === "separate") {
      tag = "Separate Frontend/Backend";
    } else if (
      backendFrameworks.includes(value) ||
      frontendFrameworks.includes(value) ||
      fullStackFrameworks.includes(value)
    ) {
      tag = capitalizeFirst(value);
    } else {
      tag = value;
    }

    return "#" + tag;
  };

  return (
    <div>
      {Object.entries(answers).map(([key, value]) => (
        <span key={key} style={{ marginRight: "10px" }}>
          {taggifyAnswer(key, value)}
        </span>
      ))}
    </div>
  );
}
