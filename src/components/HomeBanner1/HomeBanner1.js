import React, { useState } from "react";
import CircularProgress from "@mui/joy/CircularProgress";
import { AiOutlineEye } from "react-icons/ai";
import "./HomeBanner1.css";
import { apiUrl } from "@/utils/api";

const HomeBanner1 = () => {
  const [data, setData] = useState(null);

  const getData = async () => {
    fetch(apiUrl("/report/getreport"), {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.ok) {
          setData(response.data);
        }
      })
      .catch((err) => {
        console.log("error is coming");
        console.log(err);
      });
  };

  React.useEffect(() => {
    getData();
  }, []);

  function simplifyFraction(numerator, denominator) {
    function gcd(a, b) {
      return b === 0 ? a : gcd(b, a % b);
    }
    const commonDivisor = gcd(numerator, denominator);
    const simplifiedNumerator = numerator / commonDivisor;
    const simplifiedDenominator = denominator / commonDivisor;
    return [simplifiedNumerator, simplifiedDenominator];
  }

  return (
    <div className="meters">
      {data?.length > 0 &&
        data.map((item, index) => (
          <div className="card" key={index}>
            <div className="card-header">
              <div className="card-header-box">
                <div className="card-header-box-name">{item.name}</div>
                <div className="card-header-box-value">
                  {item.value} {item.unit}
                </div>
              </div>
              <div className="card-header-box">
                <div className="card-header-box-name">Target</div>
                <div className="card-header-box-value">
                  {item.goal} {item.unit}
                </div>
              </div>
            </div>

            <CircularProgress color="neutral" determinate variant="solid" size="lg" value={(item.value / item.goal) * 100}>
              <span className="textincircle">{simplifyFraction(item.value, item.goal)[0] + " / " + simplifyFraction(item.value, item.goal)[1]}</span>
            </CircularProgress>

            <button onClick={() => (window.location.href = `/report/${item.name}`)}>
              Show Report <AiOutlineEye />
            </button>
          </div>
        ))}
    </div>
  );
};

export default HomeBanner1;
