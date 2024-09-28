"use client"
import React from 'react'
import { LineChart } from '@mui/x-charts/LineChart';
import './ReportPage.css'
import { AiFillEdit } from 'react-icons/ai'
import CaloriIntakePopup from '@/components/ReportFormPopup/CalorieIntake/CalorieIntakePopup';
import { stringify } from 'querystring';
import { useParams } from 'next/navigation';
import SleepTakenPopup from '@/components/ReportFormPopup/SleepTaken/SleepTakenPopup';

const page = () => {
    let { type } = useParams();
    const color = '#ffc20e'
    const chartParams = {
        height: 300,
    }
    if (Array.isArray(type)) {
        type = type[0];
    }
    type = type ? type.toLowerCase() : '';
    const [dataS1, setDataS1] = React.useState<any>(null);
    console.log(type)
    const renderPopup = () => {
        if (type=="calorieintake") {
          return <CaloriIntakePopup setShowCalorieIntakePopup={setShowPopup} />;
        } else if (type == "sleep") {
          return <SleepTakenPopup setShowSleepTakenPopup={setShowPopup} />;
        } else if(type == "steps"){

        } else if(type == "water"){

        } else if(type == "workout"){

        } else if(type == "weight"){

        }
      };


    const getDataForS1 = async () => {
        fetch(process.env.NEXT_PUBLIC_BACKEND_API + `/${type}track/get${type}bylimit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ limit: 7 }),
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    let temp = data.data;
                    if (temp && temp.length ) {
                        console.log("data is there", temp);
                        let dataForLineChart = temp.map((item: any) => {
                            let val = JSON.stringify(item.value)
                            return val
                        })

                        let dataForXAxis = temp.map((item: any) => {
                            let val = new Date(item.date)
                            console.log(val)
                            return val
                        })

                        setDataS1({
                            data: dataForLineChart,
                            title: '1 Day Calorie Intake',
                            color: color,
                            xAxis: {
                                data: dataForXAxis,
                                label: 'Last 10 days',
                                scaleType: 'time'
                            }
                        })
                    }
                    else{
                        console.log("data is not there");
                        setDataS1(null)
                    }
                }
            }).catch(err => {
                console.log("error in fetching data")
            })
    }

    React.useEffect(() => {
        getDataForS1();
    }, [])

    const [showpopup, setShowPopup] = React.useState<boolean>(false);

    return (
        <div className='reportpage'>
            <div className="s1">
                {
                    dataS1 &&
                    <LineChart
                        xAxis={[{
                            id: 'Day',
                            data: dataS1.xAxis.data,
                            scaleType: dataS1.xAxis.scaleType,
                            valueFormatter: (date: any) => {
                                return date.getDate().toString();
                            }
                        }]}
                        series={[
                            {
                                data: dataS1.data,
                                label: dataS1.label,
                                color: dataS1.color,
                            },
                        ]}
                        {...chartParams}
                    />
                }
            </div>
            
            <button className='editbutton'
                onClick={() => {
                    setShowPopup(true)
                }}
            >
                <AiFillEdit />
            </button>

            {
                showpopup && renderPopup()
            }

        </div>
    )
}

export default page