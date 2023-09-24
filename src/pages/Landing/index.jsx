import styles from "./styles.module.css";

export default function Landing() {
  return (
    <main className={styles.container}>
      <section className={styles.landingContainer}>
        <img src="/pupil-logo.svg" alt="Pupil" />
        <h1>
          Pupil learns to teach <span>you</span>
        </h1>
      </section>
    </main>
  );
}
