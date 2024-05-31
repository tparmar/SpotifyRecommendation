import React from "react";
import { Fragment } from "react";

function Navbar() {
  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <div className="Container">
            <a className="navbar-brand" href="/">
              <img
                src="/spotifylogo.png"
                alt="Bootstrap"
                width="25"
                height="24"
              ></img>
            </a>
          </div>
          <a className="navbar-brand" href="/">
            SpotifyRec
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/Playlist">
                  Playlist
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Song">
                  Song
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/About">
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </Fragment>
  );
}

export default Navbar;
