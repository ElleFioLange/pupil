import React, { useContext, useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";
import { GlobalContext } from "../../context";
import { generateIntro } from "../../util/openai";

export default function Chat() {
  const globalContext = useContext(GlobalContext);
  const [draft, setDraft] = useState("");
  const [state, setState] = useState("loaded");
  const [sideMenu, setSideMenu] = useState("closed");

  const chatHistory = useMemo(
    () => (globalContext ? globalContext.globalState.chatHistory : []),
    [globalContext]
  );

  useEffect(() => {
    const load = async () => {
      const { globalState, setGlobalState } = globalContext;
      const { studentProfile, module, chatHistory } = globalState;
      console.log("start");
      const response = await generateIntro({ studentProfile, module });
      console.log(typeof response);
      setGlobalState({
        ...globalState,
        chatHistory: [
          ...chatHistory,
          {
            user: "model",
            content: response,
          },
        ],
      });

      setState("loaded");
    };

    if (globalContext && state === "pending") load();
  }, [globalContext, state]);

  const handleSideMenuButton = (button) => {
    if (sideMenu !== button) setSideMenu(button);
    else setSideMenu("closed");
  };

  const sendMessageHandler = () => {};
  return (
    <main className={styles.container}>
      {state === "pending" && <div className={`spinner ${styles.loading}`} />}
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
      <section className={styles.inputContainer}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className={styles.input}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessageHandler();
          }}
        />
      </section>
      <section
        className={styles.sideMenuContainer}
        style={{
          transition: "var(--3d-trns), transform var(--speed-lo)",
          transform: sideMenu !== "closed" ? "translate(-352px, 0)" : undefined,
        }}
      >
        <div className={styles.sideMenuButtons}>
          <button onClick={() => handleSideMenuButton("profile")}>
            <i className="ri-user-line"></i>
          </button>
          <button onClick={() => handleSideMenuButton("profile")}>
            <i className="ri-newspaper-line" />
          </button>
        </div>
        <div className={styles.sideMenuContent}>Here is the content</div>
      </section>
    </main>
  );
}
