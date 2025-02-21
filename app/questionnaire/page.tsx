"use client";

import { useState } from "react";
import QUESTION_TREE from "./QUESTION_TREE.json";
import QuestionnaireForm from "../components/QuestionnaireForm/QuestionnaireForm";
import { TagDisplay } from "../components/TagDisplay/TagDisplay";
import { QuestionKey, QuestionTree } from "@/types";

const QuestionnairePage = () => {
  const questionTree: QuestionTree = QUESTION_TREE;
  const [currentQuestionKey, setCurrentQuestionKey] =
    useState<QuestionKey>("start");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleNextQuestion = (
    questionKey: QuestionKey,
    answerValue: string,
    nextKey: QuestionKey
  ) => {
    // Update answers state
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: answerValue,
    }));

    // If questionnaire is complete, log answers
    if (nextKey === "done") {
      console.log("Final Answers:", { ...answers, [questionKey]: answerValue });
      setCurrentQuestionKey("done");
      return;
    }

    // Move to next question
    setCurrentQuestionKey(nextKey);
  };

  const handlePreviousQuestion = () => {
    setAnswers((prev) => {
      const updatedAnswers = { ...prev };

      // Get the previous question key
      const currentQuestion = questionTree[currentQuestionKey];
      const previousQuestionKey = currentQuestion?.previous;

      // Delete the answer for the question we're going back to
      if (previousQuestionKey) {
        delete updatedAnswers[previousQuestionKey];
      }

      return updatedAnswers;
    });

    // Move to the previous question
    const previousQuestionKey = questionTree[currentQuestionKey]?.previous;
    if (previousQuestionKey) {
      setCurrentQuestionKey(previousQuestionKey);
    }
  };

  return (
    <div>
      <h4>Project Questionnaire</h4>

      <TagDisplay answers={answers} />

      {/* Go Back Button */}
      {currentQuestionKey !== "start" &&
        currentQuestionKey !== "done" &&
        currentQuestionKey !== "project-name" && (
          <button onClick={handlePreviousQuestion}>Go Back</button>
        )}

      <QuestionnaireForm
        questionTree={questionTree}
        currentQuestionKey={currentQuestionKey}
        onNextQuestion={handleNextQuestion}
      />
    </div>
  );
};

export default QuestionnairePage;
