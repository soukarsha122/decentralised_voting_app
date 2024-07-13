import logo from "./logo.svg";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Candidate from "./Candiate";
import CasteVote from "./CasteVote";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import Voting from "./Voting";
import Ballot from "./Ballot";
import Result from "./Result";
// require("dotenv").config();
function App() {
  return (
    <Router>
      <div className="container">
        <Header />
        {/* Routes defined */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/candidate" element={<Candidate />} />
          <Route path="/voting" element={<CasteVote />} />
          <Route path="/ballot" element={<Ballot />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
