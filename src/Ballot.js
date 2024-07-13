import React, { useEffect, useRef, useState } from "react";
import { contractAbi, contractAddress } from "./Constant/constant";

const ethers = require("ethers");

const Ballot = () => {
  const [candidates, setCandidates] = useState([]);
  const [hide, setHide] = useState(false);
  const indexRef = useRef(null);
  const buttonRef = useRef(null);
  const resultref = useRef(null);
  const [Vote, setCanVote] = useState(false);
  const [text, setText] = useState("");

  const showCandidates = (candidates) => {};

  async function vote(number) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    const tx = await contractInstance.vote(number);
    await tx.wait();
  }

  async function getCandidates() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    const candidatesList = await contractInstance.getAllVotesOfCandiates();
    const formattedCandidates = candidatesList.map((candidate, index) => {
      return {
        index: index,
        name: candidate.name,
        voteCount: candidate.voteCount.toNumber(),
        party: candidate.party,
      };
    });
    return formattedCandidates;
  }

  async function canVote() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    const voteStatus = await contractInstance.voters(await signer.getAddress());
    setCanVote(voteStatus);
  }

  const handleClick = async () => {
    const indexVal = indexRef.current.value;
    setText("Processing your Vote!!");
    await vote(indexVal);

    setText("Successfully Voted!!!");
    setHide(true);
    // resultref.current.disabled = true;
  };

  const viewResult = () => {};

  useEffect(() => {
    const prefetch = async () => {
      const fetched_candidates = await getCandidates();
      setCandidates(fetched_candidates);
    };
    const CheckVoteStatus = async () => {
      await canVote();
    };
    const init = async () => {
      await prefetch();
      await CheckVoteStatus();
      if (Vote) {
        setHide(true);
        setText("Already Voted!!!");
        // resultref.current.disabled = true;
      }
    };
    init();
  });

  return (
    <div>
      <p id="displayStatus">{text}</p>

      <div style={{ alignItems: "center" }}>
        <div style={{ marginBottom: "0" }}>Choose Index</div>
        <div className="col-md-6" style={{ marginBottom: "0" }}>
          <select
            name="index"
            ref={indexRef}
            disabled={hide}
            style={{
              marginBottom: "0",
              appearance: "auto",
              paddingRight: "0.75rem",
              width: "100%", // Set the desired width here
            }}
          >
            {candidates.map((candidate, index) => (
              <option key={index} value={index}>
                {index}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ margin: "20px 0" }}>
        <input
          type="button"
          name="submit"
          value="Caste Vote"
          className="btn btn-success"
          onClick={handleClick}
          ref={buttonRef}
          disabled={hide}
        />
      </div>
      <hr style={{ margin: "20px 0" }} />
      <table id="myTable" className="candidates-table">
        <thead>
          <tr>
            <th>Index</th>
            <th>Candidate name</th>
            <th>Party</th>
            {/* <th>Candidate votes</th> */}
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, index) => (
            <tr key={index}>
              <td>{candidate.index}</td>
              <td>{candidate.name}</td>
              <td>{candidate.party}</td>
              {/* <td>{candidate.voteCount}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ballot;
