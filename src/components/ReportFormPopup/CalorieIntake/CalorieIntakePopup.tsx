import React from 'react'
import '../popup.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import DatePicker from "react-horizontal-datepicker";
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai'
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface CaloriIntakePopupProps {
  setShowCalorieIntakePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalorieIntakePopup: React.FC<CaloriIntakePopupProps> = ({ setShowCalorieIntakePopup }) => {
  const color = '#ffc20e'

  const [date, setDate] = React.useState<any>(new Date())

  const selectedDay = (val: any) => {
    console.log(val)
  };
  // const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17T15:30'));
  return (
    <div className='popupout' >
      <div className="popupbox">
        <button className="close"
          onClick={() => {
            setShowCalorieIntakePopup(false)
          }}
        >
          <AiOutlineClose />
        </button>

        {/* <DatePicker getSelectedDay={selectedDay}
          endDate={100}
          selectDate={new Date()}
          labelFormat={"MMMM"}
          color={color}
        /> */}

      </div>
    </div>
  )
}

export default CalorieIntakePopup