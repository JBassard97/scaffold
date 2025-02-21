"use client";

import { Span } from "next/dist/trace";
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
    const fullStackFrameworks = ["next", "laravel"];
    let tag = "";

    if (startValues.includes(value)) {
      tag = capitalizeFirst(value);
    }

    if (value === "framework") {
      tag = `${capitalizeFirst(key) + " " + capitalizeFirst(value)}`;
    }

    if (langs.includes(value) && key.split("-").includes("language")) {
      tag = capitalizeFirst(value) + " " + capitalizeFirst(key.split("-")[0]);

      if (key.split("-")[0] === "full") {
        tag = capitalizeFirst(value)
      }
    }

    if (value === "separate") {
      tag = "Separate Frontend/Backend";
    }

    if (
      backendFrameworks.includes(value) ||
      frontendFrameworks.includes(value) ||
      fullStackFrameworks.includes(value)
    ) {
      tag = capitalizeFirst(value);
    }

    return "#" + tag;
  };

  return (
    <div>
      {Object.entries(answers).map(([key, value]) => (
        <span key={key} style={{ margin: "0 10px" }}>
          {taggifyAnswer(key, value)}
        </span>
      ))}
    </div>
  );
}
