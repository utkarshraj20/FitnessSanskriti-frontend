"use client";

import React from "react";
import styles from "./page.module.css";
import { apiUrl } from "@/utils/api";

export default function ProfilePage() {
  const [status, setStatus] = React.useState("loading");
  const [profile, setProfile] = React.useState(null);

  const formatLabel = (value) => {
    if (!value) return "Not set";
    return String(value)
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (char) => char.toUpperCase());
  };

  const formatDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  React.useEffect(() => {
    fetch(apiUrl("/auth/me"), {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.ok && data?.data) {
          setProfile(data.data);
          setStatus("authenticated");
          return;
        }

        setStatus("guest");
      })
      .catch(() => {
        setStatus("guest");
      });
  }, []);

  const overviewItems = profile
    ? [
        { label: "Goal", value: formatLabel(profile.goal) },
        { label: "Activity", value: formatLabel(profile.activityLevel) },
        { label: "Gender", value: formatLabel(profile.gender) },
        { label: "Date of birth", value: formatDate(profile.dob) },
        { label: "Joined", value: formatDate(profile.joinedAt) },
        { label: "Email", value: profile.email || "Not available" },
      ]
    : [];

  const latestStats = profile
    ? [
        { label: "Weight", value: profile.latestStats?.weightInKg ? `${profile.latestStats.weightInKg} kg` : "No data yet" },
        { label: "Height", value: profile.latestStats?.heightInCm ? `${profile.latestStats.heightInCm} cm` : "No data yet" },
        { label: "Sleep", value: profile.latestStats?.sleepInHrs ? `${profile.latestStats.sleepInHrs} hrs` : "No data yet" },
        { label: "Steps", value: profile.latestStats?.steps ? `${profile.latestStats.steps}` : "No data yet" },
        { label: "Water", value: profile.latestStats?.waterInMl ? `${profile.latestStats.waterInMl} ml` : "No data yet" },
        {
          label: "Last workout",
          value: profile.latestStats?.workout
            ? `${profile.latestStats.workout.exercise} • ${profile.latestStats.workout.durationInMinutes} min`
            : "No data yet",
        },
      ]
    : [];

  const trackingTotals = profile
    ? [
        { label: "Calorie logs", value: profile.totals?.calorieEntries ?? 0 },
        { label: "Sleep logs", value: profile.totals?.sleepEntries ?? 0 },
        { label: "Step logs", value: profile.totals?.stepEntries ?? 0 },
        { label: "Water logs", value: profile.totals?.waterEntries ?? 0 },
        { label: "Workout logs", value: profile.totals?.workoutEntries ?? 0 },
        { label: "Weight logs", value: profile.totals?.weightEntries ?? 0 },
      ]
    : [];

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <p className={styles.eyebrow}>Profile</p>
        <h1>{profile?.name ? `${profile.name}'s profile` : "Your account space"}</h1>
        {status === "loading" && <p className={styles.copy}>Loading your profile...</p>}
        {status === "authenticated" && (
          <div className={styles.content}>
            <p className={styles.copy}>
              This page now shows your account details and the latest health data
              already saved in the app.
            </p>

            <section className={styles.section}>
              <h2>Overview</h2>
              <div className={styles.grid}>
                {overviewItems.map((item) => (
                  <div className={styles.card} key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <h2>Latest stats</h2>
              <div className={styles.grid}>
                {latestStats.map((item) => (
                  <div className={styles.card} key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <h2>Tracking totals</h2>
              <div className={styles.grid}>
                {trackingTotals.map((item) => (
                  <div className={styles.card} key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
        {status === "guest" && (
          <p className={styles.copy}>
            You are not logged in right now. Use the login button in the navbar to
            access your account.
          </p>
        )}
      </section>
    </main>
  );
}
