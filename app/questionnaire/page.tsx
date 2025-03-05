"use client";

import { useState, useEffect } from "react";
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags((prevTags) => [...prevTags, tag]);
    }
  };

  const handleNextQuestion = (
    questionKey: QuestionKey,
    answerValue: string,
    nextKey: QuestionKey
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: answerValue,
    }));

    if (nextKey === "done") {
      console.log("Final Answers:", { ...answers, [questionKey]: answerValue });
      console.log("Final Tags:", tags);
      setCurrentQuestionKey("done");
    } else {
      setCurrentQuestionKey(nextKey);
    }
  };

  useEffect(() => {
    if (currentQuestionKey === "done") {
      handleDownload();
    }
  }, [currentQuestionKey]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/build", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate project files.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      <h4>Project Questionnaire</h4>

      <TagDisplay tags={tags} />

      {currentQuestionKey !== "start" &&
        currentQuestionKey !== "done" &&
        currentQuestionKey !== "project-name" && (
          <button
            onClick={() =>
              setCurrentQuestionKey(questionTree[currentQuestionKey]?.previous)
            }
          >
            Go Back
          </button>
        )}

      <QuestionnaireForm
        questionTree={questionTree}
        currentQuestionKey={currentQuestionKey}
        onNextQuestion={handleNextQuestion}
        onAddTag={handleAddTag}
      />

      {downloadUrl && (
        <a href={downloadUrl} download="project-template.zip">
          <button disabled={isDownloading}>
            {isDownloading ? "Downloading..." : "Download Project Files"}
          </button>
        </a>
      )}
    </div>
  );
};

export default QuestionnairePage;
