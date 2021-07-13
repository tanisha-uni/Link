import React from "react";
import { v1 as uuid } from "uuid";
import Header from "../components/Header";
import homePage from '../assets/images/homePage.png'
import '../styles/CreateRoomStyles.css'



const CreateRoom = (props) => {
    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

  return (
    <div>
      <Header />
      <div className='container1'>
        <div className='main-text'>
          <p>One-One Video Calls</p>
          <p>Click on the button to create a room, and generate a link</p>
          <button onClick={create}
            className='room-button'
          > Create Room
          </button>
        </div>
      <img
        src={homePage}
        className='homePage-img'
      />
      </div>
      </div>
    )
}

export default CreateRoom;
