import React from "react";
import { Fragment } from "react";
import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import SongCard from "../components/SongCard";

interface SongInfo {
  id: string;
  name: string;
  image: string;
  link: string;
  artists: string;
}

function Song() {
  // State to hold the input values
  const [songName, setSongName] = useState("");
  const [numRecommendations, setNumRecommendations] = useState("");
  const [songCards, setSongCards] = useState<JSX.Element[]>([]);

  const fetchSongData = async (song: any, num_rec: any) => {
    const inputData = { "Song Name": song, Recommendations: num_rec };
    const response: AxiosResponse = await axios.post(
      "http://127.0.0.1:5000/recommend-song/",
      inputData
    );
    let resultParsed = JSON.parse(JSON.stringify(response));
    //console.log(resultParsed.data);

    let resultData = resultParsed.data;

    const cards = [];
    for (let songId in resultData.id) {
      const songIdData = { Song_id: resultData.id[songId] };

      const songInfo: AxiosResponse = await axios.post(
        "http://127.0.0.1:5000/get-song-id/",
        songIdData
      );

      var songParsed = JSON.parse(JSON.stringify(songInfo));
      var songParsedData = songParsed.data;
      console.log(songParsedData);
      var allArtists = "";

      for (let artist in songParsedData.artists) {
        allArtists += songParsedData.artists[artist].name + ", ";
        console.log(songParsedData.artists[artist]);
      }

      allArtists = allArtists.slice(0, -2);
      const songDict: SongInfo = {
        id: resultData.id[songId],
        name: resultData.name[songId],
        image: songParsedData.album.images[0].url,
        link: songParsedData.external_urls.spotify,
        artists: allArtists,
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
  // return (
  //   <div className="container mt-5">
  //     <div
  //       className="row position-absolute start-50  translate-middle"
  //       style={{ marginTop: "7%" }}
  //     >
  //       <form>
  //         <div className="mb-3">
  //           <label htmlFor="songName" className="form-label">
  //             Song
  //           </label>
  //           <input
  //             type="search"
  //             className="form-control"
  //             id="songName"
  //             aria-describedby="songSearch"
  //             placeholder="Search for song..."
  //             value={songName}
  //             onChange={(e) => setSongName(e.target.value)}
  //           ></input>
  //         </div>
  //         <div className="mb-3">
  //           <label htmlFor="numRecommendations" className="form-label">
  //             Recommendations
  //           </label>
  //           <input
  //             type="number"
  //             className="form-control"
  //             id="numRecommendations"
  //             placeholder="# of Suggestions"
  //             value={numRecommendations}
  //             onChange={(e) => setNumRecommendations(e.target.value)}
  //           ></input>
  //         </div>
  //         <button
  //           type="button"
  //           id="submitButton"
  //           className="btn btn-primary"
  //           onClick={() => fetchSongData(songName, numRecommendations)}
  //         >
  //           Submit
  //         </button>
  //       </form>
  //     </div>
  //     <div className=" row justify-content-center mt-7">
  //       <div className=" gap-5 top-100 start-50 position-absolute translate-middle d-flex flex-wrap">
  //         {songCards}
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
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
              />
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
              />
            </div>
            <button
              type="button"
              id="submitButton"
              className="btn btn-primary"
              onClick={() => fetchSongData(songName, numRecommendations)}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="row justify-content-center mt-5">
        <div className="">
          <div className="d-flex flex-wrap gap-3">{songCards}</div>
        </div>
      </div>
    </div>
  );
}

export default Song;
