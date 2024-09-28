import React from 'react'
import '../popup.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai'
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { json } from 'stream/consumers';

interface WaterIntakePopupProps {
  setShowWaterIntakePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const WaterIntakePopup: React.FC<WaterIntakePopupProps> = ({ setShowWaterIntakePopup }) => {
  const color = '#ffc20e'

  const [date, setDate] = React.useState<any>(new Date())
  const [waterIntake, setWaterIntake] = React.useState<any>()

  const selectedDay = (val: any) => {
    console.log(val)
  };

  const handleAddWaterIntake = () => {
    console.log({date, waterIntake});

    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/watertrack/addwaterentry', {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        amountInMilliliters: waterIntake,
        date: date
      }),
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if( data.ok ){
        console.log("Water Intake added successfully")
      }
    }).catch(err=>{
      console.log(err);
    })
  }

  return (
    <div className='popupout'>
      <div className='popupbox'>
        <button className='close'
          onClick={() => {
            setShowWaterIntakePopup(false)
          }}
        >
          <AiOutlineClose />
        </button>

        <LocalizationProvider dateAdapter={AdapterDayjs} >
          <DesktopDatePicker defaultValue={dayjs(new Date())}
            sx={{
              backgroundColor: 'white',
            }}
            onChange={(newValue) => {
              setDate(newValue)
              selectedDay(newValue)
            }}
          />
        </LocalizationProvider>

        <TextField 
          id="outlined-basic" 
          label="Water Intake in ml" 
          variant="outlined"
          color="warning" 
          value={waterIntake}
          onChange={(newValue) => {setWaterIntake(newValue.target.value)}}
        />
        <Button  variant="contained" color="warning" onClick={handleAddWaterIntake} >
          Save
        </Button>
      </div>
    </div>
  )
}

export default WaterIntakePopup