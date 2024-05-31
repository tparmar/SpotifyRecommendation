import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "../App";

import About from "../components/About";
import Playlist from "../components/Playlist";
import Song from "../components/Song";
import Home from "../components/Home";

function Main() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/Playlist" element={<Playlist />}></Route>
      <Route path="/Song" element={<Song />}></Route>
      <Route path="/About" element={<About />}></Route>
    </Routes>
  );
}

export default Main;
