"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Question, Answer, Build } from "@/types/forumTypes";
import Navbar from "@/components/Navbar";

export default function ForumPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"questions" | "builds">(
    "questions"
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [questionContent, setQuestionContent] = useState("");
  const [buildName, setBuildName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [answerContent, setAnswerContent] = useState("");
  const [selectedBuild, setSelectedBuild] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [questionAnswers, setQuestionAnswers] = useState<{
    [key: string]: Answer[];
  }>({});
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "questions") {
        const response = await fetch("/api/questions");
        const data = await response.json();
        setQuestions(data.questions || []);
      } else {
        const response = await fetch("/api/builds");
        const data = await response.json();
        setBuilds(data.builds || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: questionContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create question");
      }

      setShowQuestionModal(false);
      setQuestionContent("");
      fetchData();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleShareBuild = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      const response = await fetch("/api/builds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: buildName,
          description: "",
          isPublic: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to share build");
      }

      setShowBuildModal(false);
      setBuildName("");
      fetchData();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleAnswer = async (questionId: string) => {
    if (!answerContent.trim()) return;

    try {
      const response = await fetch(`/api/questions/${questionId}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: answerContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error:", data);
        alert(data.error || "Failed to submit answer");
        return;
      }

      setSelectedQuestion(null);
      setAnswerContent("");

      // Refresh answers for this question
      const answersResponse = await fetch(
        `/api/questions/${questionId}/answers`
      );
      const answersData = await answersResponse.json();
      setQuestionAnswers((prev) => ({
        ...prev,
        [questionId]: answersData.answers || [],
      }));

      // Expand the question to show the new answer
      const newExpanded = new Set(expandedQuestions);
      newExpanded.add(questionId);
      setExpandedQuestions(newExpanded);

      fetchData();
    } catch (error) {
      console.error("Failed to submit answer:", error);
      alert("Failed to submit answer. Please try again.");
    }
  };

  const handleReply = async (buildId: string) => {
    if (!replyContent.trim()) return;

    try {
      const response = await fetch(`/api/builds/${buildId}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: replyContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error:", data);
        alert(data.error || "Failed to submit reply");
        return;
      }

      setSelectedBuild(null);
      setReplyContent("");
      fetchData();
    } catch (error) {
      console.error("Failed to submit reply:", error);
      alert("Failed to submit reply. Please try again.");
    }
  };

  const toggleAnswers = async (questionId: string) => {
    const isExpanded = expandedQuestions.has(questionId);

    if (isExpanded) {
      // Collapse
      const newExpanded = new Set(expandedQuestions);
      newExpanded.delete(questionId);
      setExpandedQuestions(newExpanded);
    } else {
      // Expand and fetch answers if not already fetched
      const newExpanded = new Set(expandedQuestions);
      newExpanded.add(questionId);
      setExpandedQuestions(newExpanded);

      if (!questionAnswers[questionId]) {
        try {
          const response = await fetch(`/api/questions/${questionId}/answers`);
          const data = await response.json();
          setQuestionAnswers((prev) => ({
            ...prev,
            [questionId]: data.answers || [],
          }));
        } catch (error) {
          console.error("Failed to fetch answers:", error);
        }
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="w-full flex justify-center pb-20 pt-32 bg-slate-950">
        <div className="max-w-[1440px] w-[90%]">
          {/* Header */}
          <div className="mb-12 md:mb-16">
            <h1 className="bg-gradient-to-r from-blue-500 via-green-400 to-blue-600 inline-block text-transparent bg-clip-text font-bold text-4xl md:text-7xl mb-8">
              Forum
            </h1>

            {/* Ask Question Input */}
            <div className="mb-18">
              <p className="text-white mb-4 text-lg">Ask Question</p>
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  placeholder="ask question"
                  onClick={() => session && setShowQuestionModal(true)}
                  readOnly
                  className="flex-1 px-4 py-3 bg-transparent border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7ED348] cursor-pointer"
                />
                {session && (
                  <button
                    onClick={() => setShowBuildModal(true)}
                    className="bg-[#3B82F6] hover:bg-[#2563EB] transition-all text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 text-base whitespace-nowrap"
                  >
                    share build
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
                      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs and Content */}
          <div className="mb-8">
            <h2 className="text-white text-3xl md:text-4xl font-semibold mb-8">
              {activeTab === "questions" ? "Questions" : "Shared Builds"}
            </h2>

            {/* Tab Buttons */}
            <div className="flex gap-4 mb-10">
              <button
                onClick={() => setActiveTab("questions")}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "questions"
                    ? "bg-slate-700 text-white"
                    : "bg-transparent text-gray-400 hover:text-white"
                }`}
              >
                questions
              </button>
              <button
                onClick={() => setActiveTab("builds")}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "builds"
                    ? "bg-slate-700 text-white"
                    : "bg-transparent text-gray-400 hover:text-white"
                }`}
              >
                builds
              </button>
            </div>

            {/* Content */}
            {loading ? (
              <div className="text-center text-gray-400 py-20">Loading...</div>
            ) : activeTab === "questions" ? (
              <div className="flex flex-col gap-4">
                {questions.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-gray-400 text-lg">No questions yet</p>
                  </div>
                ) : (
                  questions.map((question) => (
                    <div
                      key={question._id}
                      className="bg-[#0f2557] rounded-lg border border-[#1e3a8a]"
                    >
                      <div className="flex items-start justify-between gap-4 p-6">
                        <div className="flex items-start gap-4 flex-1">
                          {/* User Avatar and Info */}
                          <div className="flex flex-col items-center gap-2 min-w-[80px]">
                            {question.userImage ? (
                              <Image
                                src={question.userImage}
                                alt={question.username}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-base font-semibold">
                                {question.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="text-center">
                              <p className="text-white font-medium text-sm">
                                {question.username}
                              </p>
                              <p className="text-gray-400 text-xs truncate max-w-[80px]">
                                {question.userEmail}
                              </p>
                            </div>
                          </div>

                          {/* Question Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xl font-normal leading-relaxed mb-3">
                              {question.content}
                            </p>
                            <div className="flex items-center gap-4">
                              {question.answerCount > 0 && (
                                <button
                                  onClick={() => toggleAnswers(question._id)}
                                  className="text-[#7ED348] hover:text-[#6BC23A] text-sm font-medium"
                                >
                                  {expandedQuestions.has(question._id)
                                    ? `Hide ${question.answerCount} ${
                                        question.answerCount === 1
                                          ? "answer"
                                          : "answers"
                                      }`
                                    : `View ${question.answerCount} ${
                                        question.answerCount === 1
                                          ? "answer"
                                          : "answers"
                                      }`}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Answer Button */}
                        {session && (
                          <button
                            onClick={() => setSelectedQuestion(question._id)}
                            className="bg-[#1e293b] hover:bg-[#334155] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex-shrink-0"
                          >
                            answer
                          </button>
                        )}
                      </div>

                      {/* Display Answers */}
                      {expandedQuestions.has(question._id) &&
                        questionAnswers[question._id] && (
                          <div className="mt-4 pt-4 border-t border-blue-600 space-y-3">
                            {questionAnswers[question._id].map((answer) => (
                              <div
                                key={answer._id}
                                className="bg-[#1e293b] rounded-lg p-4"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex items-center gap-2">
                                    {answer.userImage ? (
                                      <Image
                                        src={answer.userImage}
                                        alt={answer.username}
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                      />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-[#7ED348] flex items-center justify-center text-black text-xs font-semibold">
                                        {answer.username
                                          .charAt(0)
                                          .toUpperCase()}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="text-white font-medium text-sm">
                                        {answer.username}
                                      </p>
                                      <span className="text-gray-500 text-xs">
                                        {formatDate(answer.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-gray-300 text-sm">
                                      {answer.content}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Answer Modal */}
                      {selectedQuestion === question._id && (
                        <div className="mt-4 pt-4 border-t border-blue-600">
                          <textarea
                            value={answerContent}
                            onChange={(e) => setAnswerContent(e.target.value)}
                            placeholder="Write your answer..."
                            className="w-full px-4 py-3 bg-[#0a0e1a] border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7ED348] mb-3 min-h-[100px]"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                setSelectedQuestion(null);
                                setAnswerContent("");
                              }}
                              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleAnswer(question._id)}
                              disabled={!answerContent.trim()}
                              className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Submit Answer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {builds.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-gray-400 text-lg">
                      No builds shared yet
                    </p>
                  </div>
                ) : (
                  builds.map((build) => (
                    <div
                      key={build._id}
                      className="bg-[#1e3a8a] rounded-lg p-6 border border-blue-700"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="flex items-center gap-2">
                            {build.userImage ? (
                              <Image
                                src={build.userImage}
                                alt={build.username}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-sm font-semibold">
                                {build.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="mb-1">
                              <p className="text-white font-medium">
                                {build.username}
                              </p>
                              {build.userEmail && (
                                <p className="text-gray-400 text-sm">
                                  {build.userEmail}
                                </p>
                              )}
                            </div>
                            <p className="text-white text-lg mt-2">
                              {build.username} shared a build{" "}
                              <span className="text-[#7ED348]">
                                :{build.name}
                              </span>
                            </p>
                          </div>
                        </div>
                        {session && (
                          <button
                            onClick={() => setSelectedBuild(build._id)}
                            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                          >
                            reply
                          </button>
                        )}
                      </div>

                      {/* Reply Modal */}
                      {selectedBuild === build._id && (
                        <div className="mt-4 pt-4 border-t border-blue-600">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write your reply..."
                            className="w-full px-4 py-3 bg-[#0a0e1a] border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7ED348] mb-3 min-h-[100px]"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                setSelectedBuild(null);
                                setReplyContent("");
                              }}
                              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleReply(build._id)}
                              disabled={!replyContent.trim()}
                              className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Submit Reply
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Ask Question Modal */}
          {showQuestionModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
              <div className="bg-[#0a1628] rounded-lg p-8 max-w-md w-full relative border border-blue-700">
                <button
                  onClick={() => {
                    setShowQuestionModal(false);
                    setQuestionContent("");
                    setError("");
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">
                  Ask a Question
                </h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleAskQuestion}>
                  <textarea
                    placeholder="What's your question?"
                    value={questionContent}
                    onChange={(e) => setQuestionContent(e.target.value)}
                    required
                    minLength={3}
                    maxLength={500}
                    className="w-full px-4 py-3 bg-[#0a0e1a] border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7ED348] mb-6 min-h-[120px]"
                  />

                  <button
                    type="submit"
                    disabled={creating || questionContent.length < 3}
                    className="w-full px-6 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Share Build Modal */}
          {showBuildModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
              <div className="bg-[#0a1628] rounded-lg p-8 max-w-md w-full relative border border-blue-700">
                <button
                  onClick={() => {
                    setShowBuildModal(false);
                    setBuildName("");
                    setError("");
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">
                  Share Build
                </h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleShareBuild}>
                  <input
                    type="text"
                    placeholder="Build name"
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    required
                    minLength={3}
                    className="w-full px-4 py-3 bg-[#0a0e1a] border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7ED348] mb-6"
                  />

                  <button
                    type="submit"
                    disabled={creating || buildName.length < 3}
                    className="w-full px-6 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? "Sharing..." : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
