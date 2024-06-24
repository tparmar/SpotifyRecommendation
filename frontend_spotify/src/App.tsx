import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Navbar from "./components/Navbar";
import { Fragment } from "react";
import Main from "./router/Main";

function App() {
  return (
    <div>
      <Navbar />
      <body>
        <Main />
      </body>
    </div>
  );
}

export default App;
