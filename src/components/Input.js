import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineArrowRight } from "react-icons/ai";

const Input = ({ socket }) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [text, setText] = useState(null);
  const [approved, setApproved] = useState(false);
  //entering to the room
  const enterRoom = async () => {
    setApproved(true);
    await socket.emit("join-room", { room: state.id, name: text });
    await socket.on("room-full", () => {
      setApproved(false);
      navigate("/", {
        state: {
          error: "Room is full",
        },
      });
    });
    await socket.on("No-room", () => {
      setApproved(false);
      console.log("room not exited");
      navigate("/", {
        state: {
          error: "Room not exited",
        },
      });
    });
    if (approved) {
      navigate(`/room/${state.id}`, {
        state: {
          name: text,
        },
      });
    }
  };


  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="container"
        initial={{ x: "100vw", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        exit={{
          opacity: 0,
          x: "-100vw",
          transition: { duration: 1, delay: 0.1 },
        }}
      >
        <div className="input">
          <input
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={() => enterRoom()}><AiOutlineArrowRight className="icon"/></button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Input;
