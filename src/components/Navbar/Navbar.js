"use client";
import React from "react";
import logo from "@/assets/logo.png";
import { IoIosBody } from "react-icons/io";
import "./Navbar.css";
import Image from "next/image";
import Link from "next/link";
import AuthPopup from "../AuthPopup/AuthPopup";
import { toast } from "react-toastify";
import { authFetch, clearLocalAuthCookies } from "@/utils/api";

const Navbar = () => {
  const [isloggedIn, setIsloggedin] = React.useState(false);
  const [showpopup, setShowpopup] = React.useState(false);

  const checklogin = async () => {
    authFetch("/auth/checklogin", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setIsloggedin(true);
        } else {
          setIsloggedin(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogout = () => {
    authFetch("/auth/logout", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          clearLocalAuthCookies();
          toast.success(data.message);
          setIsloggedin(false);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        console.log("Logout failed:", err);
        toast.error("Logout failed. Please try again.");
      });
  };

  React.useEffect(() => {
    checklogin();
  }, [showpopup]);

  return (
    <nav>
      <Image src={logo} alt="Logo" />
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/profile">
        <IoIosBody />
      </Link>
      {isloggedIn ? <button onClick={handleLogout}>Logout</button> : <button onClick={() => setShowpopup(true)}>Login</button>}
      {showpopup && <AuthPopup setShowpopup={setShowpopup} />}
    </nav>
  );
};

export default Navbar;
