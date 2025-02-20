"use client";

import { useState } from "react";
import QUESTION_TREE from "./QUESTION_TREE.json";
import QuestionnaireForm from "../components/QuestionnaireForm/QuestionnaireForm";
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

  return (
    <div>
      <h1>Project Questionnaire</h1>
      <QuestionnaireForm
        questionTree={questionTree}
        currentQuestionKey={currentQuestionKey}
        onNextQuestion={handleNextQuestion}
      />
    </div>
  );
};

export default QuestionnairePage;
