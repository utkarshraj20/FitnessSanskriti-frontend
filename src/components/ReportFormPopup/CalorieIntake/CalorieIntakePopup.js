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

const CalorieIntakePopup = ({ setShowCalorieIntakePopup }) => {
  const [date, setDate] = React.useState(new Date());
  const [foodName, setFoodName] = React.useState("");
  const [foodAmount, setFoodAmount] = React.useState("");

  const handleAddCalorie = () => {
    authFetch("/calorieintaketrack/addcalorieintake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: foodName, date, quantity: foodAmount, quantitytype: "g" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) console.log("calorie added successfully");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="popupout">
      <div className="popupbox">
        <button className="close" onClick={() => setShowCalorieIntakePopup(false)}>
          <AiOutlineClose />
        </button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker defaultValue={dayjs(new Date())} sx={{ backgroundColor: "white" }} onChange={(newValue) => setDate(newValue)} />
        </LocalizationProvider>
        <TextField id="outlined-basic" label="Food item name" variant="outlined" color="warning" value={foodName} onChange={(e) => setFoodName(e.target.value)} />
        <TextField id="outlined-basic" label="Food item amount (in gms)" variant="outlined" color="warning" value={foodAmount} onChange={(e) => setFoodAmount(parseInt(e.target.value, 10) || 0)} />
        <Button variant="contained" color="warning" onClick={handleAddCalorie}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default CalorieIntakePopup;
