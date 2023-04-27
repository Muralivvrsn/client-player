import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
const Message = ({ socket }) => {
  const { state } = useLocation();
  const [color, setColor] = useState("#ffffff");
  const [name, setName] = useState(null);
  const { id } = useParams();
  const changeColor = async () => {
    await socket.emit("send_message", {
      room: id,
      name: state.name,
    });
  };
  useEffect(() => {
    socket.on("recieved_message", (data) => {
      setColor(data.color);
      setName(data.name);
    });
  }, [socket]);
  return (
    <div className="message" style={{ backgroundColor: `${color}` }}>
      <div className="color">
        <button onClick={() => changeColor()}>Click </button>
      </div>
      <div className="div">
        {state && state.name && state.name === name
          ? "you changed the color"
          : `The player ${name} has changed the color`}
      </div>
    </div>
  );
};

export default Message;