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

interface CaloriIntakePopupProps {
  setShowCalorieIntakePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalorieIntakePopup: React.FC<CaloriIntakePopupProps> = ({ setShowCalorieIntakePopup }) => {
  const color = '#ffc20e'

  const [date, setDate] = React.useState<any>(new Date())
  const [foodName, setFoodName] = React.useState<String|null>() ;
  const [foodAmount, setFoodAmount] = React.useState<Number|null>();

  const selectedDay = (val: any) => {
    console.log(val)
  };

  const handleAddCalorie = () => {
    console.log({date, foodName, foodAmount});

    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintaketrack/addcalorieintake', {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        item: foodName,
        date: date,
        quantity: foodAmount,
        quantitytype: 'g'
      }),
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if( data.ok ){
        console.log("calorie added successfully")
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
            setShowCalorieIntakePopup(false)
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
          label="Food item name" 
          variant="outlined" 
          color="warning" 
          value={foodName}
          onChange={(newValue) => {setFoodName(newValue.target.value)}}
        />
        <TextField 
          id="outlined-basic" 
          label="Food item amount (in gms)" 
          variant="outlined" 
          color="warning" 
          value={foodAmount}
          onChange={(newValue) => {setFoodAmount(parseInt(newValue.target.value))}}
        />
        <Button  variant="contained" color="warning" onClick={handleAddCalorie} >
          Save
        </Button>
        {/* <div className='hrline'></div>
        <div className='items'>
          <div className='item'>
            <h3>Apple</h3>
            <h3>100 gms</h3>
            <button> <AiFillDelete /></button>
          </div>
          <div className='item'>
            <h3>Banana</h3>
            <h3>200 gms</h3>
            <button> <AiFillDelete /></button>

          </div>
          <div className='item'>
            <h3>Rice</h3>
            <h3>300 gms</h3>
            <button> <AiFillDelete /></button>

          </div>
        </div> */}
      </div>
    </div>
  )
}

export default CalorieIntakePopup