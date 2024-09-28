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

interface WeightStatusPopupProps {
  setShowWeightStatusPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const WeightStatusPopup: React.FC<WeightStatusPopupProps> = ({ setShowWeightStatusPopup }) => {
  const color = '#ffc20e'

  const [date, setDate] = React.useState<any>(new Date())
  const [weight, setWeight] = React.useState<any>()

  const selectedDay = (val: any) => {
    console.log(val)
  };

  const handleAddWeight = () => {
    console.log({date, weight});

    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/weighttrack/addweightentry', {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        weightInKg: weight,
        date: date
      }),
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if( data.ok ){
        console.log("Weight added successfully")
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
            setShowWeightStatusPopup(false)
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
          label="Add Current Weight" 
          variant="outlined"
          color="warning" 
          value={weight}
          onChange={(newValue) => {setWeight(newValue.target.value)}}
        />
        <Button  variant="contained" color="warning" onClick={handleAddWeight} >
          Save
        </Button>
      </div>
    </div>
  )
}

export default WeightStatusPopup