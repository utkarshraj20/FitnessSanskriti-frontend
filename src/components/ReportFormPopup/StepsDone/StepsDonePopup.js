import React from "react";
import "../popup.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AiOutlineClose } from "react-icons/ai";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { apiUrl } from "@/utils/api";

const StepsDonePopup = ({ setShowStepsDonePopup }) => {
  const [date, setDate] = React.useState(new Date());
  const [stepsTaken, setStepsTaken] = React.useState("");

  const handleAddSteps = () => {
    fetch(apiUrl("/stepstrack/addstepentry"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steps: stepsTaken, date }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) console.log("Steps added successfully");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="popupout">
      <div className="popupbox">
        <button className="close" onClick={() => setShowStepsDonePopup(false)}>
          <AiOutlineClose />
        </button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker defaultValue={dayjs(new Date())} sx={{ backgroundColor: "white" }} onChange={(newValue) => setDate(newValue)} />
        </LocalizationProvider>
        <TextField id="outlined-basic" label="Steps Taken" variant="outlined" color="warning" value={stepsTaken} onChange={(e) => setStepsTaken(e.target.value)} />
        <Button variant="contained" color="warning" onClick={handleAddSteps}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default StepsDonePopup;
