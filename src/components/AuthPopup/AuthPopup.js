import React, { useState } from "react";
import "./AuthPopup.css";
import Image from "next/image";
import logo from "@/assets/logo.png";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { AiOutlineClose } from "react-icons/ai";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { toast } from "react-toastify";
import { apiUrl, setLocalAuthCookies } from "@/utils/api";

const AuthPopup = ({ setShowpopup }) => {
  const [showSignup, setShowSignup] = React.useState(false);
  const [signupformData, setSignupFormData] = useState({
    name: "",
    email: "",
    password: "",
    weightInKg: 0.0,
    heightInCm: 0.0,
    goal: "",
    gender: "",
    dob: new Date(),
    activityLevel: "",
  });
  const [loginformData, setLoginFormData] = useState({ email: "", password: "" });

  const handleLogin = () => {
    fetch(apiUrl("/auth/login"), {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(loginformData),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setLocalAuthCookies(data?.data?.authToken, data?.data?.refreshToken);
          toast.success(data.message);
          setShowpopup(false);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSignup = () => {
    fetch(apiUrl("/auth/register"), {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(signupformData),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          toast.success(data.message);
          setShowpopup(false);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="popup">
      <button className="close" onClick={() => setShowpopup(false)}>
        <AiOutlineClose />
      </button>
      {showSignup ? (
        <div className="authform">
          <div className="left">
            <Image src={logo} alt="Logo" />
          </div>
          <div className="right">
            <h1>Signup to become the freak</h1>
            <form action="">
              <Input color="warning" placeholder="name" size="lg" variant="outlined" onChange={(e) => setSignupFormData({ ...signupformData, name: e.target.value })} />
              <Input color="warning" placeholder="email" size="lg" variant="outlined" onChange={(e) => setSignupFormData({ ...signupformData, email: e.target.value })} />
              <Input color="warning" placeholder="password" size="lg" variant="outlined" type="password" onChange={(e) => setSignupFormData({ ...signupformData, password: e.target.value })} />
              <Input color="warning" size="lg" variant="outlined" type="number" placeholder="Weight In Kg" onChange={(e) => setSignupFormData({ ...signupformData, weightInKg: parseFloat(e.target.value) })} />
              <Select color="warning" placeholder="Activity Level" size="lg" variant="solid" onChange={(event, newValue) => setSignupFormData({ ...signupformData, activityLevel: newValue?.toString() || "" })}>
                <Option value="sedentary">Sedentary</Option>
                <Option value="light">Light</Option>
                <Option value="moderate">Moderate</Option>
                <Option value="active">Active</Option>
                <Option value="veryactive">Very Active</Option>
              </Select>
              <Select color="warning" placeholder="Goal" size="lg" variant="solid" onChange={(event, newValue) => setSignupFormData({ ...signupformData, goal: newValue?.toString() || "" })}>
                <Option value="weightLoss">Loss</Option>
                <Option value="weightMaintain">Maintain</Option>
                <Option value="weightGain">Gain</Option>
              </Select>
              <Select color="warning" placeholder="Gender" size="lg" variant="solid" onChange={(event, newValue) => setSignupFormData({ ...signupformData, gender: newValue?.toString() || "" })}>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
              <label htmlFor="">Height</label>
              <Input color="warning" size="lg" variant="solid" type="number" placeholder="cm" onChange={(e) => setSignupFormData({ ...signupformData, heightInCm: parseFloat(e.target.value) })} />
              <label htmlFor="">Date of Birth</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  defaultValue={dayjs(new Date())}
                  sx={{ backgroundColor: "white" }}
                  onChange={(newValue) => {
                    setSignupFormData({
                      ...signupformData,
                      dob: new Date(newValue),
                    });
                  }}
                />
              </LocalizationProvider>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSignup();
                }}
              >
                Signup
              </button>
            </form>
            <p>
              Already have an account? <button onClick={() => setShowSignup(false)}>Login</button>
            </p>
          </div>
        </div>
      ) : (
        <div className="authform">
          <div className="left">
            <Image src={logo} alt="Logo" />
          </div>
          <div className="right">
            <h1>Login to become the freak</h1>
            <form action="">
              <Input color="warning" placeholder="email" size="lg" variant="outlined" onChange={(e) => setLoginFormData({ ...loginformData, email: e.target.value })} />
              <Input color="warning" placeholder="password" size="lg" variant="outlined" type="password" onChange={(e) => setLoginFormData({ ...loginformData, password: e.target.value })} />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                Login
              </button>
            </form>
            <p>
              Don't have an account? <button onClick={() => setShowSignup(true)}>Signup</button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPopup;
