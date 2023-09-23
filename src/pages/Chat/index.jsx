import React, { useContext, useMemo } from "react";
import styles from "./styles.module.css";
import { GlobalContext } from "../../context";

export default function Chat() {
  const globalContext = useContext(GlobalContext);

  const chatHistory = useMemo(
    () => (globalContext ? globalContext.globalState.chatHistory : []),
    [globalContext]
  );

  console.log(globalContext);
  return (
    <main className={styles.container}>
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
      <div className={styles.inputContainer}>
        <input className={styles.input} />
      </div>
      <section className={styles.sideMenu}></section>
    </main>
  );
}
