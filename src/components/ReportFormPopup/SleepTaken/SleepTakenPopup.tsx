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

interface SleepTakenPopupProps {
  setShowSleepTakenPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const SleepTakenPopup: React.FC<SleepTakenPopupProps> = ({ setShowSleepTakenPopup }) => {
  const color = '#ffc20e'

  const [date, setDate] = React.useState<any>(new Date())
  const [sleepHours, setSleepHours] = React.useState<any>()

  const selectedDay = (val: any) => {
    console.log(val)
  };

  const handleAddSleep = () => {
    console.log({date, sleepHours});

    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/sleeptrack/addsleepentry', {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        durationInHrs: sleepHours,
        date: date
      }),
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if( data.ok ){
        console.log("Sleep added successfully")
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
            setShowSleepTakenPopup(false)
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
          label="Food Sleep Hours" 
          variant="outlined"
          color="warning" 
          value={sleepHours}
          onChange={(newValue) => {setSleepHours(newValue.target.value)}}
        />
        <Button  variant="contained" color="warning" onClick={handleAddSleep} >
          Save
        </Button>
      </div>
    </div>
  )
}

export default SleepTakenPopup