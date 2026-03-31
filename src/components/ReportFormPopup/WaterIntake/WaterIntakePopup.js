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

const WaterIntakePopup = ({ setShowWaterIntakePopup }) => {
  const [date, setDate] = React.useState(new Date());
  const [waterIntake, setWaterIntake] = React.useState("");

  const handleAddWaterIntake = () => {
    authFetch("/watertrack/addwaterentry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountInMilliliters: waterIntake, date }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) console.log("Water Intake added successfully");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="popupout">
      <div className="popupbox">
        <button className="close" onClick={() => setShowWaterIntakePopup(false)}>
          <AiOutlineClose />
        </button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker defaultValue={dayjs(new Date())} sx={{ backgroundColor: "white" }} onChange={(newValue) => setDate(newValue)} />
        </LocalizationProvider>
        <TextField id="outlined-basic" label="Water Intake in ml" variant="outlined" color="warning" value={waterIntake} onChange={(e) => setWaterIntake(e.target.value)} />
        <Button variant="contained" color="warning" onClick={handleAddWaterIntake}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default WaterIntakePopup;
