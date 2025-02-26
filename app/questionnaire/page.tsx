"use client";

import { useState } from "react";
import QUESTION_TREE from "./QUESTION_TREE.json";
import QuestionnaireForm from "../components/QuestionnaireForm/QuestionnaireForm";
import { TagDisplay } from "../components/TagDisplay/TagDisplay";
import { QuestionKey, QuestionTree } from "@/types";

const QuestionnairePage = () => {
  const questionTree: any = QUESTION_TREE;
  const [currentQuestionKey, setCurrentQuestionKey] =
    useState<QuestionKey>("start");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [tags, setTags] = useState<string[]>([]);

  // New function to handle adding tags
  const handleAddTag = (tag: string) => {
    // Only add the tag if it doesn't already exist
    if (!tags.includes(tag)) {
      setTags((prevTags) => [...prevTags, tag]);
    }
  };

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

    // If questionnaire is complete, log answers and tags
    if (nextKey === "done") {
      console.log("Final Answers:", { ...answers, [questionKey]: answerValue });
      console.log("Final Tags:", tags);
      setCurrentQuestionKey("done");
      return;
    }

    // Move to next question
    setCurrentQuestionKey(nextKey);
  };

  const handlePreviousQuestion = () => {
    // Get the current question
    const currentQuestion = questionTree[currentQuestionKey];
    const previousQuestionKey = currentQuestion?.previous;

    if (previousQuestionKey) {
      // We need to check if the current answer had a tag associated with it
      const currentAnswerValue = answers[currentQuestionKey];

      if (currentAnswerValue) {
        // Find the selected option that corresponds to this answer
        const selectedOption = currentQuestion.options?.find(
          (opt: any) => opt.value === currentAnswerValue
        );

        // If this option had a tag, we need to remove it
        if (selectedOption?.tag) {
          setTags((prevTags) =>
            prevTags.filter((tag) => tag !== selectedOption.tag)
          );
        }
      }

      // Update answers - remove the current answer when going back
      setAnswers((prev) => {
        const updatedAnswers = { ...prev };
        delete updatedAnswers[currentQuestionKey];
        return updatedAnswers;
      });

      // Move to the previous question
      setCurrentQuestionKey(previousQuestionKey);
    }
  };

  return (
    <div>
      <h4>Project Questionnaire</h4>

      <TagDisplay tags={tags} />

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
        onAddTag={handleAddTag}
      />
    </div>
  );
};

export default QuestionnairePage;
