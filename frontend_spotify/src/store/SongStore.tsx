// import React, { useState, useEffect } from "react";
// import axios, { AxiosResponse } from "axios";
// import { createSlice } from "@reduxjs/toolkit";
// import { createRoot } from "react-dom/client";
// import addSongCard from "../components/SongCard";

// interface SongInfo {
//   id: string;
//   name: string;
//   image: string;
//   link: string;
//   artists: string;
// }
// export default async (song: any, num_rec: any) => {
//   // const [results, updateResult] = useState({ results: "" });

//   const inputData = { "Song Name": song, Recommendations: num_rec };

//   const response: AxiosResponse = await axios.post(
//     "http://127.0.0.1:5000/recommend-song/",
//     inputData
//   );

//   let resultParsed = JSON.parse(JSON.stringify(response));

//   const cards = [];

//   for (var songId of resultParsed.id) {
//     const songIdData = { Song_id: songId };

//     const songInfo: AxiosResponse = await axios.post(
//       "http://127.0.0.1:5000/get-song-id/",
//       songIdData
//     );

//     var songParsed = JSON.parse(JSON.stringify(songInfo));
//     console.log(songParsed);

//     const songDict: SongInfo = {
//       id: songId,
//       name: songParsed.name,
//       image: songParsed.album.images[0].url,
//       link: songParsed.external_urls.spotify,
//     };

//     cards.push(addSongCard(songDict));
//   }

//   const container = document.getElementById("root");
//   const root = createRoot(container!);
//   root.render(
//     <div className="container text-center" id="SongDiv">
//       <div className="row" id="row1">
//         {cards}
//       </div>
//     </div>
//   );
// };
