"use client";

import React from "react";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";
import { apiUrl } from "@/utils/api";
import "./ChatbotWidget.css";

const starterQuestions = [
  "How is my recent progress going?",
  "What should I improve in my diet?",
  "How can I recover better after workouts?",
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [messages, setMessages] = React.useState([
    {
      role: "assistant",
      content:
        "Ask me about your workouts, diet, recovery, or how your recent fitness data looks.",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const checkLogin = React.useCallback(() => {
    fetch(apiUrl("/auth/checklogin"), {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoggedIn(Boolean(data?.ok));
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  React.useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  const sendMessage = async (text) => {
    const trimmedMessage = String(text || "").trim();
    if (!trimmedMessage || isLoading) return;

    const nextUserMessage = { role: "user", content: trimmedMessage };
    const updatedMessages = [...messages, nextUserMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(apiUrl("/chat/ask"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message: trimmedMessage,
          history: updatedMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      const data = await response.json();

      if (data?.ok && data?.data?.reply) {
        setMessages((currentMessages) => [
          ...currentMessages,
          { role: "assistant", content: data.data.reply },
        ]);
      } else {
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            role: "assistant",
            content: data?.message || "I couldn't answer that right now. Please try again.",
          },
        ]);
      }
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: "I couldn't reach the chat service right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <button
        className="chatbotToggle"
        onClick={() => setIsOpen((current) => !current)}
        aria-label="Toggle chatbot"
      >
        {isOpen ? <FiX /> : <FiMessageCircle />}
      </button>

      {isOpen && (
        <section className="chatbotPanel">
          <div className="chatbotPanel__header">
            <div>
              <span>FitnessSanskriti AI</span>
              <p>Your workout and diet assistant</p>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close chatbot">
              <FiX />
            </button>
          </div>

          <div className="chatbotPanel__starters">
            {starterQuestions.map((question) => (
              <button key={question} onClick={() => sendMessage(question)} disabled={isLoading}>
                {question}
              </button>
            ))}
          </div>

          <div className="chatbotPanel__messages">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chatbotMessage chatbotMessage--${message.role}`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="chatbotMessage chatbotMessage--assistant">
                Thinking...
              </div>
            )}
          </div>

          <form className="chatbotPanel__composer" onSubmit={handleSubmit}>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about your progress, exercise form, diet, or recovery..."
              rows={3}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <FiSend />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
