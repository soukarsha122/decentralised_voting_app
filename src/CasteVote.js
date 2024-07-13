import React, { useEffect, useReducer, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const CasteVote = () => {
  const location = useLocation();
  const resultref = useRef(null);
  let history = useNavigate();
  const [visible, setVisible] = useState(false);

  const [votingStarted, setVoteStarted] = useState(false);

  const handleClick = () => {
    const login_id = location.state.login;
    const sendData = { user_login: login_id };

    axios
      .post("http://localhost/Project/getDates.php", sendData)
      .then((response) => {
        const data = response.data;
        const currentTime = new Date();
        data.forEach((func) => {
          const startDateTime = new Date(
            `${func.start_date}T${func.start_time}`
          );
          const endDateTime = new Date(`${func.end_date}T${func.end_time}`);

          let statusMessage = "";

          if (currentTime < startDateTime) {
            alert(
              `Your Voting Phase starting at ${startDateTime.toLocaleString()} and ending at ${endDateTime.toLocaleString()} is yet to start.`
            );
          } else if (
            currentTime >= startDateTime &&
            currentTime <= endDateTime
          ) {
            history("/ballot", {
              state: {
                state: location.state.state,
                city: location.state.city,
                district: location.state.district,
                constituency: location.state.constituency,
              },
            });
          } else if (currentTime > endDateTime) {
            alert(
              `Your Voting Phase starting at ${startDateTime.toLocaleString()} and ending at ${endDateTime.toLocaleString()}has ended.`
            );
          }

          // statusDiv.innerHTML += `<p>${statusMessage}</p>`;
        });
      });
  };
  useEffect(() => {
    const viewResult = () => {
      const RESULT_START_DATE = "2024-06-04";
      const RESULT_START_TIME = "15:27:48";
      const RESULT_END_DATE = "2024-06-17";
      const RESULT_END_TIME = "16:25:48";
      const currentTime = new Date();
      console.log(currentTime);
      console.log(RESULT_START_DATE);
      const startDateTime = new Date(
        `${RESULT_START_DATE}T${RESULT_START_TIME}`
      );
      const endDateTime = new Date(`${RESULT_END_DATE}T${RESULT_END_TIME}`);
      if (currentTime < startDateTime || currentTime > endDateTime) {
        console.log("NO");
        setVisible(false);
        // alert("GONE");
      } else if (currentTime >= startDateTime && currentTime <= endDateTime) {
        console.log("YES");
        setVisible(true);
        // alert("HELLO");
      }
    };
    viewResult();
  }, []);
  const showResult = () => {
    history("/result");
  };

  return (
    <div>
      <input
        type="button"
        name="submit"
        value="VOTE"
        className="btn btn-success"
        onClick={handleClick}
      />
      <div style={{ margin: "20px 0" }}>
        <input
          type="button"
          name="submit"
          value="Show results"
          className="btn btn-success"
          onClick={showResult}
          style={{ display: visible ? "block" : "none" }}
          ref={resultref}
        />
      </div>
    </div>
  );
};

export default CasteVote;
