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

interface WorkoutDonePopupProps {
  setShowWorkoutDonePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkoutDonePopup: React.FC<WorkoutDonePopupProps> = ({ setShowWorkoutDonePopup }) => {
  const color = '#ffc20e'

  const [date, setDate] = React.useState<any>(new Date())
  const [durationInMinutes, setDurationInMinutes] = React.useState<any>();
  const [exerciseName, setExerciseName] = React.useState<any>()

  const selectedDay = (val: any) => {
    console.log(val)
  };

  const handleAddWorkoutDone = () => {
    console.log({date, durationInMinutes, exerciseName});

    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/workouttrack/addworkoutentry', {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        date: date,
        exercise: exerciseName,
        durationInMinutes: durationInMinutes
      }),
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if( data.ok ){
        console.log("Workout added successfully")
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
            setShowWorkoutDonePopup(false)
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
          label="Duration in Mins" 
          variant="outlined"
          color="warning" 
          value={durationInMinutes}
          onChange={(newValue) => {setDurationInMinutes(newValue.target.value)}}
        />
        <TextField 
          id="outlined-basic" 
          label="Exercise" 
          variant="outlined"
          color="warning" 
          value={exerciseName}
          onChange={(newValue) => {setExerciseName(newValue.target.value)}}
        />
        <Button  variant="contained" color="warning" onClick={handleAddWorkoutDone} >
          Save
        </Button>
      </div>
    </div>
  )
}

export default WorkoutDonePopup