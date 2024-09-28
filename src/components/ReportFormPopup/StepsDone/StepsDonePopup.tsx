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

interface StepsTakenPopupProps {
  setShowStepsDonePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const StepsDonePopup: React.FC<StepsTakenPopupProps> = ({ setShowStepsDonePopup }) => {
  const color = '#ffc20e'

  const [date, setDate] = React.useState<any>(new Date())
  const [stepsTaken, setStepsTaken] = React.useState<any>()

  const selectedDay = (val: any) => {
    console.log(val)
  };

  const handleAddSteps = () => {
    console.log({date, stepsTaken});

    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/steptrack/addstepentry', {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        steps: stepsTaken,
        date: date
      }),
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if( data.ok ){
        console.log("Steps added successfully")
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
            setShowStepsDonePopup(false)
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
          label="Steps Taken" 
          variant="outlined"
          color="warning" 
          value={stepsTaken}
          onChange={(newValue) => {setStepsTaken(newValue.target.value)}}
        />
        <Button  variant="contained" color="warning" onClick={handleAddSteps} >
          Save
        </Button>
      </div>
    </div>
  )
}

export default StepsDonePopup