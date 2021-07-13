import React from 'react'
// import logo from '../assets/images/logo.png'
import '../styles/Header.css'

const fullDate = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const minutes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
const month = months[fullDate.getMonth()]
const day = days[fullDate.getDay()]
const date = fullDate.getDate()
const hours = fullDate.getHours()
const minute = minutes[fullDate.getMinutes()]

export default function Header() {
  return (
    <div className='container'>
      {/* <img
        src={logo}
        alt='webApp logo'
        className='logo-img'
      /> */}
      <p className='link-text'>Link</p>
      <div className='date-time'>{hours}:{minute}~ {day},{month} {date}</div>
    </div>
  )
}
