"use client";

import React, { useState } from "react";
import { QuestionTree, QuestionKey } from "@/types";

interface QuestionnaireFormProps {
  questionTree: QuestionTree;
  currentQuestionKey: QuestionKey;
  onNextQuestion: (
    questionKey: QuestionKey,
    answerValue: string,
    nextKey: QuestionKey
  ) => void;
  onAddTag?: (tags: string[]) => void;
  setRecentTags: React.Dispatch<React.SetStateAction<string[]>>; // Accept setRecentTags
  downloadUrl?: string | null;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({
  questionTree,
  currentQuestionKey,
  onNextQuestion,
  onAddTag,
  setRecentTags,
  downloadUrl,
}) => {
  const currentQuestion = questionTree[currentQuestionKey];

  const isValidProjectName = (name: string) => /^[A-Za-z0-9 -]+$/.test(name);

  const sanitizeProjectName = (name: string) =>
    name
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/gi, "")
      .toLowerCase();

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedName = sanitizeProjectName(e.target.value);
    onNextQuestion(currentQuestionKey, sanitizedName, "done");
  };

  const handleComplete = () => {
    if (!isValidProjectName(currentQuestionKey)) {
      alert(
        "Invalid project name! Use only lowercase letters, numbers, and dashes (-)."
      );
      return;
    }
    onNextQuestion(currentQuestionKey, currentQuestionKey, "done");
  };

  const handleOptionSelect = (option: any) => {
    // Add tags associated with the selected option
    if (option["tag"]) {
      const tagsToAdd = Array.isArray(option.tag) ? option.tag : [option.tag];

      // Add tagsToAdd as a single array element to recentTags
      setRecentTags((prev) => [...prev, tagsToAdd]); // Now tagsToAdd is added as a whole array

      // The original onAddTag behavior remains unchanged
      onAddTag && onAddTag(tagsToAdd);
    }

    onNextQuestion(currentQuestionKey, option.value, option.next);
  };

  if (!currentQuestion) return <p>Error: Question not found.</p>;

  return (
    <div>
      {!downloadUrl ? <h2>{currentQuestion.question}</h2> : <h2>Done!</h2>}

      {currentQuestionKey === "project-name" ? (
        <div>
          <input
            type="text"
            value={currentQuestionKey}
            onChange={handleProjectNameChange}
            placeholder="Enter project name (e.g., my-app)"
          />
          <button onClick={handleComplete}>Complete</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionSelect(option)}
            >
              <p>{option.label}</p>
              {option.description && <p>{option.description}</p>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionnaireForm;
