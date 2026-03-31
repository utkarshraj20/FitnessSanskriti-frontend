"use client";

import React from "react";
import { toast } from "react-toastify";
import styles from "./page.module.css";
import { authFetch } from "@/utils/api";

const goalOptions = [
  { value: "weightLoss", label: "Weight Loss" },
  { value: "weightMaintain", label: "Weight Maintain" },
  { value: "weightGain", label: "Weight Gain" },
];

const activityOptions = [
  { value: "sedentary", label: "Sedentary" },
  { value: "light", label: "Light" },
  { value: "moderate", label: "Moderate" },
  { value: "active", label: "Active" },
  { value: "veryactive", label: "Very Active" },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export default function ProfilePage() {
  const [status, setStatus] = React.useState("loading");
  const [profile, setProfile] = React.useState(null);
  const [formData, setFormData] = React.useState({
    name: "",
    gender: "",
    dob: "",
    goal: "",
    activityLevel: "",
    weightInKg: "",
    heightInCm: "",
  });
  const [isSaving, setIsSaving] = React.useState(false);

  const formatLabel = (value) => {
    if (!value) return "Not set";
    return String(value)
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (char) => char.toUpperCase());
  };

  const formatDate = (value) => {
    if (!value) return "Not available";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not available";

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatDateInput = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const hydrateProfile = (data) => {
    setProfile(data);
    setFormData({
      name: data?.name || "",
      gender: data?.gender || "",
      dob: formatDateInput(data?.dob),
      goal: data?.goal || "",
      activityLevel: data?.activityLevel || "",
      weightInKg: data?.latestStats?.weightInKg ?? "",
      heightInCm: data?.latestStats?.heightInCm ?? "",
    });
  };

  const loadProfile = React.useCallback(() => {
    setStatus("loading");

    authFetch("/auth/me", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.ok && data?.data) {
          hydrateProfile(data.data);
          setStatus("authenticated");
          return;
        }

        setStatus("guest");
      })
      .catch(() => {
        setStatus("guest");
      });
  }, []);

  React.useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.gender || !formData.dob || !formData.goal || !formData.activityLevel) {
      toast.error("Please fill in the required profile details.");
      return;
    }

    try {
      setIsSaving(true);
      const response = await authFetch("/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!data?.ok) {
        toast.error(data?.message || "Unable to update profile.");
        return;
      }

      toast.success(data.message || "Profile updated successfully.");
      loadProfile();
    } catch (error) {
      toast.error("Unable to update profile right now.");
    } finally {
      setIsSaving(false);
    }
  };

  const overviewItems = profile
    ? [
        { label: "Email", value: profile.email || "Not available" },
        { label: "Goal", value: formatLabel(profile.goal) },
        { label: "Activity", value: formatLabel(profile.activityLevel) },
        { label: "Gender", value: formatLabel(profile.gender) },
        { label: "Date of birth", value: formatDate(profile.dob) },
        { label: "Joined", value: formatDate(profile.joinedAt) },
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
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Profile</p>
          <h1>{profile?.name ? `${profile.name}'s account` : "Your account space"}</h1>
          <p className={styles.copy}>
            Keep your personal fitness setup current so your dashboard, goals, and tracking context
            stay accurate.
          </p>
        </div>

        <div className={styles.heroPanel}>
          <span>Account status</span>
          <strong>{status === "authenticated" ? "Logged in and ready to update" : "Sign in to manage your profile"}</strong>
          <p>
            Edit your personal details, keep height and weight current, and use the summary below
            to stay close to your latest health data.
          </p>
        </div>
      </section>

      {status === "loading" && <section className={styles.messagePanel}>Loading your profile...</section>}

      {status === "guest" && (
        <section className={styles.messagePanel}>
          You are not logged in right now. Use the login button in the navbar to access your account.
        </section>
      )}

      {status === "authenticated" && (
        <div className={styles.layout}>
          <section className={styles.editor}>
            <div className={styles.sectionHeader}>
              <p className={styles.kicker}>Edit profile</p>
              <h2>Update your core details</h2>
            </div>

            <form className={styles.form} onSubmit={handleSave}>
              <label className={styles.field}>
                <span>Name</span>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Your name" />
              </label>

              <label className={styles.field}>
                <span>Date of birth</span>
                <input name="dob" type="date" value={formData.dob} onChange={handleChange} />
              </label>

              <label className={styles.field}>
                <span>Gender</span>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select gender</option>
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                <span>Goal</span>
                <select name="goal" value={formData.goal} onChange={handleChange}>
                  <option value="">Select goal</option>
                  {goalOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                <span>Activity level</span>
                <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
                  <option value="">Select activity level</option>
                  {activityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                <span>Current weight (kg)</span>
                <input name="weightInKg" type="number" step="0.1" value={formData.weightInKg} onChange={handleChange} placeholder="Weight in kg" />
              </label>

              <label className={styles.field}>
                <span>Current height (cm)</span>
                <input name="heightInCm" type="number" step="0.1" value={formData.heightInCm} onChange={handleChange} placeholder="Height in cm" />
              </label>

              <button className={styles.saveButton} type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save profile"}
              </button>
            </form>
          </section>

          <section className={styles.summary}>
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <p className={styles.kicker}>Overview</p>
                <h2>Account snapshot</h2>
              </div>
              <div className={styles.grid}>
                {overviewItems.map((item) => (
                  <div className={styles.card} key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <p className={styles.kicker}>Latest stats</p>
                <h2>Most recent fitness data</h2>
              </div>
              <div className={styles.grid}>
                {latestStats.map((item) => (
                  <div className={styles.card} key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <p className={styles.kicker}>Tracking totals</p>
                <h2>How much history you have</h2>
              </div>
              <div className={styles.grid}>
                {trackingTotals.map((item) => (
                  <div className={styles.card} key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
