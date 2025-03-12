"use client";

import { useState, useEffect } from "react";
import QUESTION_TREE from "./QUESTION_TREE.json";
import QuestionnaireForm from "../components/QuestionnaireForm/QuestionnaireForm";
import { TagDisplay } from "../components/TagDisplay/TagDisplay";
import { QuestionKey } from "@/types";

const QuestionnairePage = () => {
  const questionTree: any = QUESTION_TREE;
  const [currentQuestionKey, setCurrentQuestionKey] =
    useState<QuestionKey>("start");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [tags, setTags] = useState<string[]>([]); // Single state to hold all tags
  const [recentTags, setRecentTags] = useState<string[]>([]); // Move recentTags here
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    console.log("Answers:", answers);
    console.log("Tags:", tags);
    console.log("Recent Tags:", recentTags);
  }, [answers, tags, recentTags]);

  // Handle adding new tags
  const handleAddTag = (tagsToAdd: string[]) => {
    setTags((prevTags) => [...prevTags, ...tagsToAdd]);
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

  const handleReset = () => {
    setCurrentQuestionKey("start");
    setAnswers({});
    setTags([]);
    setRecentTags([]); // Reset recentTags
    setDownloadUrl(null);
    setIsDownloading(false);
  };

  const handleGoBack = () => {
    const currentQuestion = questionTree[currentQuestionKey];
    if (!currentQuestion?.previous) return;

    const previousKey = currentQuestion.previous;

    // Remove current question from answers
    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[currentQuestionKey];
      return updated;
    });

    // Get the most recent tags array (the last item in recentTags)
    if (recentTags.length > 0) {
      // Get the last array in recentTags
      const lastTagsArray = recentTags[recentTags.length - 1];

      // Remove these tags from the tags state
      setTags((prevTags) =>
        prevTags.filter((tag) => !lastTagsArray.includes(tag))
      );

      // Remove the last array from recentTags
      setRecentTags((prev) => prev.slice(0, -1));
    }

    setCurrentQuestionKey(previousKey);
  };

  return (
    <div>
      <h4>Project Questionnaire</h4>

      <TagDisplay tags={tags} />

      <button onClick={handleReset}>Start Over</button>

      {questionTree[currentQuestionKey]?.previous && (
        <button onClick={handleGoBack}>⬅️ Go Back</button>
      )}

      <QuestionnaireForm
        questionTree={questionTree}
        currentQuestionKey={currentQuestionKey}
        onNextQuestion={handleNextQuestion}
        onAddTag={handleAddTag}
        setRecentTags={setRecentTags} // Pass the function to child component
        downloadUrl={downloadUrl}
      />

      {downloadUrl && (
        <a href={downloadUrl} download="project.zip">
          <button disabled={isDownloading}>
            {isDownloading ? "Downloading..." : "Download Project Files"}
          </button>
        </a>
      )}
    </div>
  );
};

export default QuestionnairePage;
