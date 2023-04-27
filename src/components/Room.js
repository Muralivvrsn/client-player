import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
const Room = ({ socket, players, user, join, disconnect }) => {
  // const [text, setText] = useState({});
  console.log("-->user", join);
  const [room, setRoom] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const containerVariants = {
    hidden: {
      opacity: 0,
      x: "100vw",
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", delay: 0.5 },
    },
    exit: {
      x: "-100vh",
      transition: { ease: "easeInOut" },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      textShadow: "0px 0px 8px rgb(255,255,255)",
      boxShadow: "0px 0px 8px rgb(255,255,255)",
      transition: {
        duration: 0.3,
        yoyo: Infinity,
      },
    },
  };

  useEffect(() => {
    if (state === null || state === undefined || state.name === null) {
      navigate("/room", {
        state: {
          id,
        },
      });
    }
  });
  useEffect(() => {
    if (players.length >= 4) {
      setRoom(true);
    } else {
      setRoom(false);
    }
  }, [players, room]);

  return (
    <motion.div
      className="toppings container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h3>Players</h3>
      {join && (
        <div className="container notification joined">
          {user &&
            state &&
            `${
              user.name === state.name
                ? "You entered the game"
                : `The player ${user.name} has entered the game`
            }`}
        </div>
      )}
      <ul>
        {players.map((item, index) => {
          return (
            <motion.li
              key={item.id}
              className={`player player-${index}`}
              whileHover={{ scale: 1.3, originX: 0, color: "#f8e112" }}
              transition={{ tyep: "spring", stiffness: 300 }}
            >
              <span className={`${item.name === state.name ? "active" : ""}`}>
                {item.name}
              </span>
            </motion.li>
          );
        })}
      </ul>
      {room && (
        <motion.button variants={buttonVariants} whileHover="hover">
          Start
        </motion.button>
      )}
      {!room && (
        <motion.button variants={buttonVariants} whileHover="hover">
          x
        </motion.button>
      )}
      {disconnect && (
        <div className="container notification red">
          {user && `The player ${user.name} has exited the game.`}
        </div>
      )}
    </motion.div>
  );
};

export default Room;
