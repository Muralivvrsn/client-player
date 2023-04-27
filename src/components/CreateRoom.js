import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineArrowRight } from "react-icons/ai";

const CreateRoom = ({ socket }) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [error, setError] = useState(null);
  const [id, setId] = useState(null);
  const [nextPage, setNextPage] = useState(false);

  //navigating to the next page
  useEffect(() => {
    if (nextPage) {
      navigate(`/room`, {
        state: {
          id,
        },
      });
    }
    if (state !== null) {
      setError(state.error);
    }
  }, [nextPage, id, navigate, state]);

  //create room function
  const createRoom = async () => {
    await socket.emit("create-room");
    await socket.on("room-id", (data) => {
      setId(data.id);
      setNextPage(true);
    });
  };

  //join room function
  const joinRoom = async () => {
    if (id !== null && id !== undefined && id !== "") {
      setNextPage(true);
    } else {
      setError("Room Id is empty");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 5000);
  },[error]);
  const buttonVariants = {
    hover: {
      scale: 1.1,
      textShadow: "0px 0px 8px rgb(255,255,255)",
      transition: {
        duration: 0.3,
        yoyo: 5
      }
    }
  }
  
  const containerVariants = {
    hidden: { 
      opacity: 0, 
    },
    visible: { 
      opacity: 1, 
      transition: { delay: 1.5, duration: 1.5 }
    },
    exit: {
      x: "-100vh",
      transition: { ease: 'easeInOut' }
    }
  };

  return (
    <motion.div
      className="home container"
      key="room"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h2>Welcome to Pizza Joint</h2>
      <div className="create-room">
        <motion.button 
        variants={buttonVariants}
        whileHover="hover"
        onClick={() => createRoom()}>Create Room</motion.button>
        <p className="or">or</p>
        <div className="input join-room">
          <input
            type="text"
            onChange={(e) => {
              setId(e.target.value);
            }}
            placeholder="Type room id"
          />
          <motion.button onClick={() => joinRoom()}
          variants={buttonVariants}
          whileHover="hover"
          ><AiOutlineArrowRight className="icon"/></motion.button>
          <div className={`${error != null ? "container error notification red" : "d-none"}`}>{error}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateRoom;
