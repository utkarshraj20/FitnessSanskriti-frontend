"use client";
import React from "react";
import { useParams } from "next/navigation";
import "./workoutPage.css";
import { apiUrl } from "@/utils/api";

const page = () => {
  const { type } = useParams();
  const [workout, setWorkout] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const getWorkout = async () => {
    if (!type) return;

    try {
      setLoading(true);
      setError("");
      const response = await fetch(apiUrl(`/workoutplans/workouts/${type}`), { cache: "no-store" });
      const data = await response.json();

      if (data?.ok && data.data) {
        setWorkout(data.data);
        return;
      }

      // Backward compatibility: old links may pass workout name instead of id.
      const allWorkoutsResponse = await fetch(apiUrl("/workoutplans/workouts"), { cache: "no-store" });
      const allWorkouts = await allWorkoutsResponse.json();
      const matchedWorkout = (allWorkouts?.data || []).find(
        (item) => item?.name?.toLowerCase() === String(type).toLowerCase()
      );

      if (matchedWorkout) {
        setWorkout(matchedWorkout);
      } else {
        setWorkout(null);
        setError("Workout not found.");
      }
    } catch (fetchError) {
      setWorkout(null);
      setError("Unable to fetch workout.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getWorkout();
  }, [type]);

  if (loading) {
    return (
      <div className="workout">
        <h1 className="mainhead1">Loading workout...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="workout">
        <h1 className="mainhead1">{error}</h1>
      </div>
    );
  }

  return (
    <div className="workout">
      <h1 className="mainhead1">{workout?.name} Day</h1>
      <div className="workout__exercises">
        {workout?.exercises.map((item, index) => (
          <div className={index % 2 === 0 ? "workout__exercise" : "workout__exercise workout__exercise--reverse"} key={index}>
            <h3>{index + 1}</h3>
            <div className="workout__exercise__image">
              <img src={item.imageURL} alt={item.name} />
            </div>
            <div className="workout__exercise__content">
              <h2>{item.name}</h2>
              <span>
                {item.sets} sets X {item.reps} reps
              </span>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
