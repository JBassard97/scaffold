"use client";

import React from "react";
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

  if (!currentQuestion) return <p>Error: Question not found.</p>;

  return (
    <div>
      <h2>{currentQuestion.question}</h2>
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
    </div>
  );
};

export default QuestionnaireForm;
