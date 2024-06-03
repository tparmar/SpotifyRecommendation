import React from "react";
import { Fragment } from "react";

function Song() {
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
          ></input>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Song;
