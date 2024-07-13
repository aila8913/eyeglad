import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import EyegladAmazonADs from "./components/EyegladAmazonADs";
import AmazonMarketing from "./components/AmazonMarketing";

const App = () => {
  return (
    <div className="container">
      <h1 className="mb-4">EYEGLAD Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link to="/eyeglad-amazon-ads">Eyeglad Amazon ADs</Link>
          </li>
          <li>
            <Link to="/amazon-marketing">Amazon Marketing</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/eyeglad-amazon-ads" element={<EyegladAmazonADs />} />
        <Route path="/amazon-marketing" element={<AmazonMarketing />} />
      </Routes>
    </div>
  );
};

export default App;
