"use client";
import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import "./ReportPage.css";
import { AiFillEdit } from "react-icons/ai";
import CaloriIntakePopup from "@/components/ReportFormPopup/CalorieIntake/CalorieIntakePopup";
import { useParams } from "next/navigation";
import SleepTakenPopup from "@/components/ReportFormPopup/SleepTaken/SleepTakenPopup";
import StepsDonePopup from "@/components/ReportFormPopup/StepsDone/StepsDonePopup";
import WaterIntakePopup from "@/components/ReportFormPopup/WaterIntake/WaterIntakePopup";
import WorkoutDonePopup from "@/components/ReportFormPopup/WorkoutDone/WorkoutDonePopup";
import WeightStatusPopup from "@/components/ReportFormPopup/WeightStatus/WeightStatusPopup";
import { authFetch } from "@/utils/api";

const page = () => {
  let { type } = useParams();
  const color = "#ffc20e";
  const chartParams = { height: 300 };

  if (Array.isArray(type)) type = type[0];
  type = type ? type.toLowerCase() : "";

  const [dataS1, setDataS1] = React.useState(null);
  const [showpopup, setShowPopup] = React.useState(false);

  const renderPopup = () => {
    if (type === "calorieintake") return <CaloriIntakePopup setShowCalorieIntakePopup={setShowPopup} />;
    if (type === "sleep") return <SleepTakenPopup setShowSleepTakenPopup={setShowPopup} />;
    if (type === "steps") return <StepsDonePopup setShowStepsDonePopup={setShowPopup} />;
    if (type === "water") return <WaterIntakePopup setShowWaterIntakePopup={setShowPopup} />;
    if (type === "workout") return <WorkoutDonePopup setShowWorkoutDonePopup={setShowPopup} />;
    if (type === "weight") return <WeightStatusPopup setShowWeightStatusPopup={setShowPopup} />;
    return null;
  };

  const getDataForS1 = async () => {
    authFetch(`/${type}track/get${type}bylimit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ limit: 7 }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.ok) {
          const temp = response.data;
          if (temp && temp.length) {
            const dataForLineChart = temp.map((item) => JSON.stringify(item.value));
            const dataForXAxis = temp.map((item) => new Date(item.date));
            setDataS1({
              data: dataForLineChart,
              title: "1 Day Calorie Intake",
              color,
              xAxis: { data: dataForXAxis, label: "Last 10 days", scaleType: "time" },
            });
          } else {
            setDataS1(null);
          }
        }
      })
      .catch(() => {
        console.log("error in fetching data");
      });
  };

  React.useEffect(() => {
    getDataForS1();
  }, []);

  return (
    <div className="reportpage">
      <div className="s1">
        {dataS1 && (
          <LineChart
            xAxis={[
              {
                id: "Day",
                data: dataS1.xAxis.data,
                scaleType: dataS1.xAxis.scaleType,
                valueFormatter: (date) => date.getDate().toString(),
              },
            ]}
            series={[{ data: dataS1.data, label: dataS1.label, color: dataS1.color }]}
            {...chartParams}
          />
        )}
      </div>

      <button className="editbutton" onClick={() => setShowPopup(true)}>
        <AiFillEdit />
      </button>
      {showpopup && renderPopup()}
    </div>
  );
};

export default page;
