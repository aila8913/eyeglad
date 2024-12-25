import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import EyegladAmazonADs from "./components/EyegladAmazonADs";
import AmazonMarketing from "./components/AmazonMarketing";
import "./App.css"; // 導入 CSS 文件

const App = () => {
  return (
    <div className="container">
      <h1 className="mb-4">EYEGLAD Dashboard</h1>
      <nav>
        <ul style={{ display: "flex", listStyle: "none", padding: 0 }}>
          <li style={{ marginRight: "10px" }}>
            <Link to="/eyeglad-amazon-ads">Eyeglad Amazon ADs</Link>
          </li>
          <li>
            <Link to="/amazon-marketing">Amazon Marketing</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/eyeglad-amazon-ads" />} />
        <Route path="/eyeglad-amazon-ads" element={<EyegladAmazonADs />} />
        <Route path="/amazon-marketing" element={<AmazonMarketing />} />
      </Routes>
    </div>
  );
};

export default App;
