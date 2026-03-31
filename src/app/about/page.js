import styles from "./page.module.css";

const pillars = [
  {
    title: "Daily awareness",
    body: "Keep your core habits visible by tracking calories, water, sleep, steps, workouts, and weight in one place.",
  },
  {
    title: "Simple workout flow",
    body: "Browse ready-made workout plans and jump straight into exercise instructions without a complicated setup.",
  },
  {
    title: "Consistent progress",
    body: "Use short-term charts and repeat logging to stay honest about momentum instead of guessing how you are doing.",
  },
];

const highlights = [
  "A dashboard for the metrics that matter day to day",
  "Workout browsing with exercise-level guidance",
  "A lightweight experience built for repeat use, not overwhelm",
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>About FitnessSanskriti</p>
          <h1>Fitness tracking that stays focused on the habits you can actually maintain.</h1>
          <p className={styles.copy}>
            FitnessSanskriti is built to make everyday health data feel useful instead of noisy.
            It brings together tracking, workout discovery, and simple progress feedback in a
            way that is fast to use and easy to return to.
          </p>
        </div>

        <div className={styles.heroCard}>
          <span>What it helps with</span>
          <strong>Build routines around movement, recovery, and consistency.</strong>
          <p>
            The app is designed for people who want clarity across their health habits without
            managing a heavy or overly complex system.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Core pillars</p>
          <h2>What the product is centered around</h2>
        </div>
        <div className={styles.pillars}>
          {pillars.map((pillar) => (
            <article key={pillar.title} className={styles.pillarCard}>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.storyGrid}>
        <article className={styles.storyCard}>
          <p className={styles.kicker}>Why it exists</p>
          <h2>Most people do better with one clear system than six disconnected tools.</h2>
          <p>
            The product brings workout plans and habit tracking into the same place so users can
            move from planning to action to reflection without context switching.
          </p>
        </article>

        <article className={styles.listCard}>
          <p className={styles.kicker}>Highlights</p>
          <ul>
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
