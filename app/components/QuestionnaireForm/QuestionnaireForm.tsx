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
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({
  questionTree,
  currentQuestionKey,
  onNextQuestion,
}) => {
  const currentQuestion = questionTree[currentQuestionKey];

  const [projectName, setProjectName] = useState("");

  const isValidProjectName = (name: string) => /^[A-Za-z0-9 -]+$/.test(name); // Allows letters, numbers, spaces, and dashes

  const sanitizeProjectName = (name: string) =>
    name
      .trim() // Remove leading and trailing spaces
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/[^a-z0-9-]/gi, "") // Remove invalid characters
      .toLowerCase(); // Convert to lowercase

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(sanitizeProjectName(e.target.value));
  };

  const handleComplete = () => {
    if (!isValidProjectName(projectName)) {
      alert(
        "Invalid project name! Use only lowercase letters, numbers, and dashes (-)."
      );
      return;
    }
    onNextQuestion(currentQuestionKey, projectName, "done");
  };

  if (!currentQuestion) return <p>Error: Question not found.</p>;

  return (
    <div>
      <h2>{currentQuestion.question}</h2>

      {currentQuestionKey === "project-name" ? (
        <div>
          <input
            type="text"
            value={projectName}
            onChange={handleProjectNameChange}
            placeholder="Enter project name (e.g., my-app)"
          />
          <button onClick={handleComplete}>Complete</button>
        </div>
      ) : (
        <div>
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                onNextQuestion(currentQuestionKey, option.value, option.next)
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionnaireForm;
