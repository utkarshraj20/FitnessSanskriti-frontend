"use client"
import React from 'react'
import logo from '@/assets/logo.png'
import { IoIosBody } from 'react-icons/io'
import './Navbar.css'
import Image from 'next/image'
import Link from 'next/link'
import AuthPopup from '../AuthPopup/AuthPopup'
import { toast } from 'react-toastify';

const Navbar = () => {

  const [isloggedIn, setIsloggedin] = React.useState<boolean>(false);
  const [showpopup, setShowpopup] = React.useState<boolean>(false);

  const checklogin = async () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/checklogin`, {
      method: 'POST',
      credentials: 'include' // no use in register as no cookies
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.ok) {
          setIsloggedin(true)
        }
        else {
          setIsloggedin(false)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleLogout = () => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/auth/logout', {
      method: 'POST',
      credentials: 'include' // Ensures cookies are included
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          toast.success(data.message);
          setIsloggedin(false)
          // window.location.href = '/login';
        } else {
          toast.error(data.message);
        }
      })
      .catch(err => {
        console.log('Logout failed:', err);
        toast.error('Logout failed. Please try again.');
      });
  }

  React.useEffect(() => {
    checklogin()
  }, [showpopup])


  return (
    <nav>
      <Image src={logo} alt="Logo" />
      <Link href='/' >Home</Link>
      <Link href='/about'>About</Link>
      <Link href='/profile'><IoIosBody /></Link>
      {
        isloggedIn ?
          <button
            onClick={handleLogout}
          >Logout</button>
          :
          <button
            onClick={() => {
              setShowpopup(true);
            }}
          >Login</button>
      }

      {
        showpopup && <AuthPopup setShowpopup={setShowpopup} />
      }

    </nav>
  )
}

export default Navbar