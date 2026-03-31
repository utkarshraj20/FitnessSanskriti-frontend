import React from "react";
import "../popup.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AiOutlineClose } from "react-icons/ai";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { authFetch } from "@/utils/api";

const WorkoutDonePopup = ({ setShowWorkoutDonePopup }) => {
  const [date, setDate] = React.useState(new Date());
  const [durationInMinutes, setDurationInMinutes] = React.useState("");
  const [exerciseName, setExerciseName] = React.useState("");

  const handleAddWorkoutDone = () => {
    authFetch("/workouttrack/addworkoutentry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, exercise: exerciseName, durationInMinutes }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) console.log("Workout added successfully");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="popupout">
      <div className="popupbox">
        <button className="close" onClick={() => setShowWorkoutDonePopup(false)}>
          <AiOutlineClose />
        </button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker defaultValue={dayjs(new Date())} sx={{ backgroundColor: "white" }} onChange={(newValue) => setDate(newValue)} />
        </LocalizationProvider>
        <TextField id="outlined-basic" label="Duration in Mins" variant="outlined" color="warning" value={durationInMinutes} onChange={(e) => setDurationInMinutes(e.target.value)} />
        <TextField id="outlined-basic" label="Exercise" variant="outlined" color="warning" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} />
        <Button variant="contained" color="warning" onClick={handleAddWorkoutDone}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default WorkoutDonePopup;
