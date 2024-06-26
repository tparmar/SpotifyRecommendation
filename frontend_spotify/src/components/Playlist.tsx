import React, { useState } from "react";
import { Fragment } from "react";

function Playlist() {
  const [playlistId, setPlaylistId] = useState("");
  const [embedPlaylist, setEmbedPlaylist] = useState<JSX.Element>();

  function displayPlaylist() {
    var src = "https://open.spotify.com/embed/playlist/";
    src += playlistId + "?utm_source=generator";
    setEmbedPlaylist(
      <iframe
        style={{ borderRadius: "12px" }}
        src={src}
        width="100%"
        height="352"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    );
  }
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form>
            <div className="mb-3">
              <label htmlFor="songName" className="form-label">
                Playlist ID
              </label>
              <input
                type="search"
                className="form-control"
                id="playlistId"
                aria-describedby="playlistId"
                placeholder="Id of Playlist"
                value={playlistId}
                onChange={(e) => setPlaylistId(e.target.value)}
              />
            </div>
          </form>
          <button
            type="button"
            id="submitButton"
            className="btn btn-primary"
            onClick={() => displayPlaylist()}
          >
            Submit
          </button>
        </div>
        <div className="row justify-content-center mt-5">
          <div className="">
            <div className="d-flex flex-wrap gap-3">{embedPlaylist}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playlist;
