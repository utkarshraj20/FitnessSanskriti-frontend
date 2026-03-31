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

const SleepTakenPopup = ({ setShowSleepTakenPopup }) => {
  const [date, setDate] = React.useState(new Date());
  const [sleepHours, setSleepHours] = React.useState("");

  const handleAddSleep = () => {
    authFetch("/sleeptrack/addsleepentry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ durationInHrs: sleepHours, date }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) console.log("Sleep added successfully");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="popupout">
      <div className="popupbox">
        <button className="close" onClick={() => setShowSleepTakenPopup(false)}>
          <AiOutlineClose />
        </button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker defaultValue={dayjs(new Date())} sx={{ backgroundColor: "white" }} onChange={(newValue) => setDate(newValue)} />
        </LocalizationProvider>
        <TextField id="outlined-basic" label="Food Sleep Hours" variant="outlined" color="warning" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} />
        <Button variant="contained" color="warning" onClick={handleAddSleep}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default SleepTakenPopup;
