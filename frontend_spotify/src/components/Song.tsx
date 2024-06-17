import React from "react";
import { Fragment } from "react";
import SongStore from "../store/SongStore";
import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import SongCard from "../components/SongCard";
import { createRoot } from "react-dom/client";

interface SongInfo {
  id: string;
  name: string;
  image: string;
  link: string;
}

function Song() {
  // State to hold the input values
  const [songName, setSongName] = useState("");
  const [numRecommendations, setNumRecommendations] = useState("");
  const [songCards, setSongCards] = useState<JSX.Element[]>([]);

  const fetchSongData = async (song: any, num_rec: any) => {
    const inputData = { "Song Name": song, Recommendations: num_rec };
    console.log("hello");
    const response: AxiosResponse = await axios.post(
      "http://127.0.0.1:5000/recommend-song/",
      inputData
    );
    console.log("hello2");
    let resultParsed = JSON.parse(JSON.stringify(response));

    const cards = [];
    for (var songId of resultParsed.id) {
      const songIdData = { Song_id: songId };

      const songInfo: AxiosResponse = await axios.post(
        "http://127.0.0.1:5000/get-song-id/",
        songIdData
      );

      var songParsed = JSON.parse(JSON.stringify(songInfo));

      const songDict: SongInfo = {
        id: songId,
        name: songParsed.name,
        image: songParsed.album.images[0].url,
        link: songParsed.external_urls.spotify,
      };

      cards.push(SongCard(songDict));
    }
    setSongCards(cards);

    window.addEventListener("load", function () {
      var buttonSubmit = document.getElementById("submitButton");

      buttonSubmit?.addEventListener("submit", function (event) {
        event.preventDefault();
      });
    });
  };
  return (
    <div className="position-absolute top-50 start-50 translate-middle">
      <form>
        <div className="mb-3">
          <label htmlFor="songName" className="form-label">
            Song
          </label>
          <input
            type="search"
            className="form-control"
            id="songName"
            aria-describedby="songSearch"
            placeholder="Search for song..."
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
          ></input>
        </div>
        <div className="mb-3">
          <label htmlFor="numRecommendations" className="form-label">
            Recommendations
          </label>
          <input
            type="number"
            className="form-control"
            id="numRecommendations"
            placeholder="# of Suggestions"
            value={numRecommendations}
            onChange={(e) => setNumRecommendations(e.target.value)}
          ></input>
        </div>
        <button
          type="button"
          id="submitButton"
          className="btn btn-primary"
          onClick={() => fetchSongData(songName, numRecommendations)}
        >
          Submit
        </button>
        <div id="root">{songCards}</div>
      </form>
    </div>
  );
}

export default Song;
