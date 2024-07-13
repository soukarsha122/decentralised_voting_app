import React, { useEffect, useState } from "react";
import { contractAbi, contractAddress } from "./Constant/constant";

const ethers = require("ethers");

const Result = () => {
  const [candidates, setCandidates] = useState([]);
  useEffect(() => {
    const prefetch = async () => {
      getCandidates();
    };

    const init = async () => {
      await prefetch();
    };
    init();
  });
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
    setCandidates(formattedCandidates);
  }
  return (
    <div>
      <h1>RESULTS</h1>
      <table id="myTable" className="candidates-table">
        <thead>
          <tr>
            <th>Index</th>
            <th>Candidate name</th>
            <th>Party</th>
            <th>VoteCount</th>
            {/* <th>Candidate votes</th> */}
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, index) => (
            <tr key={index}>
              <td>{candidate.index}</td>
              <td>{candidate.name}</td>
              <td>{candidate.party}</td>
              <td>{candidate.voteCount}</td>
              {/* <td>{candidate.voteCount}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Result;
