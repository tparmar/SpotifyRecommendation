import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { createRoot } from "react-dom/client";

interface SongInfo {
  id: string;
  name: string;
  image: string;
  link: string;
  artists: string;
}

function SongCard(songDict: SongInfo) {
  return (
    <div className="card" style={{ width: 288 }}>
      <img src={songDict.image} className="card-img-top" alt="..."></img>
      <div className="card-body">
        <h5 className="card-title">{songDict.name}</h5>
        <p className="card-text">{songDict.artists}</p>
        <a href={songDict.link} className="btn btn-success">
          Listen on Spotify
        </a>
      </div>
    </div>
  );
}

export default SongCard;
