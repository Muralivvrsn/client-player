import "./App.css";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Input from "./components/Input";
import Room from "./components/Room";
import Header from "./components/Header";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import CreateRoom from "./components/CreateRoom";
const socket = io.connect("https://player-hmqp.onrender.com");

function App() {
  const [players, setPlayers] = useState([]);
  const [text, setText] = useState({});
  const [join, setJoin] = useState(false);
  const [disconnect, setDisconnect] = useState(false);
  socket.on("connect", () => {
    socket.on("joined", ({ user, users }) => {
      console.log("users", users);
      setPlayers(users);
      setText(user);
      setJoin(true);
    });
    socket.on("player-out", (data) => {
      console.log("Player-out");
      setPlayers(data.users);
      setText(data.user);
      setDisconnect(true);
    });
  });
  useEffect(() => {
    setTimeout(() => {
      setJoin(false);
      setDisconnect(false);
    }, 5000);
  }, [join, disconnect]);
  const location = useLocation();
  return (
    <div className="App" key={players}>
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.key} >
          <Route
            // key="createRoom"
            path="/"
            exact
            element={<CreateRoom socket={socket} />}
          ></Route>
          <Route
            // key="input"
            path="/room"
            exact
            element={<Input socket={socket} />}
          ></Route>
          <Route
            path="/room/:id"
            exact
            element={
              <Room
                players={players}
                socket={socket}
                user={text}
                join={join}
                disconnect={disconnect}
              />
            }
          ></Route>
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
