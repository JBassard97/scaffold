"use client";

import React from "react";

interface TagDisplayProps {
  tags: string[];
}

export function TagDisplay({ tags }: TagDisplayProps) {
  return (
    <div>
      {tags.map((tag, index) => (
        <span key={index} style={{ marginRight: "10px" }}>
          #{tag}
        </span>
      ))}
    </div>
  );
}
