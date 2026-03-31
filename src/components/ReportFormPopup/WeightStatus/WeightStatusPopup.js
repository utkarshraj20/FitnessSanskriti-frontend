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

const WeightStatusPopup = ({ setShowWeightStatusPopup }) => {
  const [date, setDate] = React.useState(new Date());
  const [weight, setWeight] = React.useState("");

  const handleAddWeight = () => {
    fetch(apiUrl("/weighttrack/addweightentry"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weightInKg: weight, date }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) console.log("Weight added successfully");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="popupout">
      <div className="popupbox">
        <button className="close" onClick={() => setShowWeightStatusPopup(false)}>
          <AiOutlineClose />
        </button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker defaultValue={dayjs(new Date())} sx={{ backgroundColor: "white" }} onChange={(newValue) => setDate(newValue)} />
        </LocalizationProvider>
        <TextField id="outlined-basic" label="Add Current Weight" variant="outlined" color="warning" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <Button variant="contained" color="warning" onClick={handleAddWeight}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default WeightStatusPopup;
