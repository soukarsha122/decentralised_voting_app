import { useState, useEffect } from "react";

import { contractAbi, contractAddress } from "./Constant/constant";
import Login from "./Components/Login";
import Finished from "./Components/Finished";
import Connected from "./Components/Connected";
import "./App.css";

const ethers = require("ethers");

const Home = () => {
  return <h1>Welcome to Home</h1>;
};
export default Home;
