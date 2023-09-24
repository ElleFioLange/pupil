import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

import { generateIntro, handleAnswer } from "../../util/openai";

export default function Chat() {
  const [draft, setDraft] = useState("");
  const [studentProfile, setStudentProfile] = useState({
    id: 1,
    name: "Jake",
    grade: 4,
    teacherInput:
      "Jake is a very hardworking young man, but he seems to struggle in math. Algebra questions in particular are tough for him, but he is good with his times tables",
    studentInput:
      "I really like reading books about racecars and superheroes. I have a red racecar bed and love to imagine racing fast!",
  });
  const [chatHistory, setChatHistory] = useState([]);
  const [module, setModule] = useState({
    id: 1,
    title: "Algebra basics",
    description:
      "This module is meant to introduce students to the basics of algebra.",
    background: `Remember the three basic steps when solving algebra problems:
1. Get all the variables to one side.
2. Get all the constants to the other side.
3. Multiply or divide to cancel out any factors.

Also make sure to follow PEMDAS!
1. Parentheses
2. Exponents
3. Multiplication / Division
4. Addition / Subtraction`,
    questions: ["Solve for x: 8x - 15 = 25", "Solve for x: 3x + 10 = 8x"],
    answers: [
      ["8x - 15 = 25", "8x = 40", "x = 5"],
      ["3x + 10 = 8x", "-5x + 10 = 0", "-5x = -10", "x = 2"],
    ],
  });
  const [chatState, setChatState] = useState("intro-pending");
  const [sideMenu, setSideMenu] = useState("closed");

  useEffect(() => {
    const loadIntro = async () => {
      console.log(chatState);
      const response = await generateIntro({ studentProfile, module });
      setChatHistory([
        ...chatHistory,
        {
          user: "model",
          content: response,
        },
      ]);

      setChatState("intro-loaded");
    };

    if (chatState === "intro-pending") loadIntro();
    // eslint-disable-next-line
  }, [chatState, chatHistory, module, studentProfile]);

  // Scroll to chat bottom when new messages are added
  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    chatContainer?.scrollTo(0, chatContainer.scrollHeight);
  }, []);

  const handleSideMenuButton = (button) => {
    console.log(sideMenu, button);
    if (sideMenu !== button) setSideMenu(button);
    else setSideMenu("closed");
  };

  const handleConfirm = () => {
    if (chatState === "intro-loaded") {
      setChatHistory([
        ...chatHistory,
        {
          user: "model",
          content: `Great, let's get to work!

${module.questions[0]}`,
        },
      ]);
      setChatState("awaiting-answer");
    }
  };

  const handleSendAnswer = async () => {
    setChatState("response-pending");
    const response = await handleAnswer({
      studentProfile,
      module,
      questionNumber: 0,
      studentAnswer: draft,
    });
    setChatHistory([
      ...chatHistory,
      {
        user: "student",
        content: draft,
      },
      {
        user: "model",
        content: response,
      },
    ]);
    setChatState("awaiting-answer");
    setDraft("");
  };

  return (
    <main
      className={styles.container}
      style={
        ((chatState === "intro-pending" ||
          chatState === "response-pending") && {
          pointerEvents: "none",
        }) ||
        undefined
      }
    >
      {(chatState === "intro-pending" || chatState === "response-pending") && (
        <div className={`spinner ${styles.loading}`} />
      )}
      <img src="/pupil-logo.svg" className={styles.logo} alt="Pupil" />
      <section className={styles.chatContainer} id="chat-container">
        {chatHistory.map(({ user, content }, i) => (
          <p
            key={content + "_" + i}
            className={styles.message}
            style={{
              marginRight: user === "student" ? 0 : "auto",
              marginLeft: user === "student" ? "auto" : 0,
              background:
                user === "student" ? "rgb(var(--blu-5))" : "rgb(var(--blu-1))",
              color: user === "student" ? "black" : "white",
            }}
          >
            {content}
          </p>
        ))}
      </section>
      {chatState !== "intro-pending" && (
        <section className={styles.inputContainer}>
          {chatState === "awaiting-answer" && (
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className={styles.input}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendAnswer();
              }}
            />
          )}
          {chatState === "intro-loaded" && (
            <button className={styles.confirmButton} onClick={handleConfirm}>
              Yes
            </button>
          )}
        </section>
      )}
      <section
        className={styles.sideMenuContainer}
        style={{
          transition: "var(--3d-trns), transform var(--speed-lo)",
          transform: sideMenu !== "closed" && "translate(-336px, 0)",
        }}
      >
        <div className={styles.sideMenuButtons}>
          <button onClick={() => handleSideMenuButton("profile")}>
            <i
              style={
                (sideMenu === "profile" && { color: "white" }) || undefined
              }
              className="ri-user-line"
            ></i>
          </button>
          <button onClick={() => handleSideMenuButton("background")}>
            <i
              style={
                (sideMenu === "background" && { color: "white" }) || undefined
              }
              className="ri-newspaper-line"
            />
          </button>
        </div>
        <div className={styles.sideMenuContent}>
          {sideMenu === "profile" && (
            <textarea
              className={styles.profile}
              value={studentProfile.studentInput}
              onChange={(e) =>
                setStudentProfile({
                  ...studentProfile,
                  studentInput: e.target.value,
                })
              }
            />
          )}
        </div>
      </section>
    </main>
  );
}
