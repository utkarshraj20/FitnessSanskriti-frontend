import styles from "./page.module.css";

const features = [
  "Track daily calorie intake, sleep, steps, water, workouts, and weight.",
  "Browse workout plans with step-by-step exercise guidance.",
  "View short-term progress charts to stay consistent with your goal.",
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>About FitnessSanskriti</p>
        <h1>Build better fitness habits with simple daily tracking.</h1>
        <p className={styles.copy}>
          FitnessSanskriti is designed to help users stay aware of everyday health
          metrics and follow structured workout plans without a complicated setup.
        </p>
      </section>

      <section className={styles.card}>
        <h2>What this app focuses on</h2>
        <div className={styles.list}>
          {features.map((feature) => (
            <div key={feature} className={styles.item}>
              {feature}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
