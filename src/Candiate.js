import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";
import { contractAbi, contractAddress } from "./Constant/constant";
const ethers = require("ethers");
const Candiate = () => {
  const location = useLocation();
  const unique_id = uuid();
  let history = useNavigate();
  const [hashedPassword, setHashedPassword] = useState("");
  const [party, setParty] = useState("");

  // Get first 8 characters using slice
  const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
  const LOGIN_TEMPLATE_ID = process.env.REACT_APP_LOGIN_TEMPLATE_ID;

  const small_id = unique_id.slice(0, 8);
  const password =
    location.state.first_name.substring(0, 4) +
    location.state.aadhar_no.toString().substring(0, 4);

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return;
    }

    // Store the hashed password in state
    setHashedPassword(hashedPassword);
  });

  const partylist = ["P_A", "P_B", "P_C", "P_D"];

  const submitForm = async (e) => {
    e.preventDefault();

    //axios part to do later
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log(provider.getCode(contractAddress));
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );

        const tx = await contract.addCandidate(
          location.state.first_name.toString() +
            " " +
            location.state.last_name.toString(),
          location.state.aadhar_no.toString(),
          party,
          { gasLimit: 300000 }
        );

        await tx.wait();

        const login_credentials = {
          to_name: location.state.first_name,
          message: `Login id is ${small_id} \n
                      Password is ${password}`,
          to_email: location.state.email,
          reply_to: "projectworkofficial.24@gmail.com",
        };
        const sendData = {
          first_name: location.state.first_name,
          last_name: location.state.last_name,
          email: location.state.email,
          // password: data.password,
          aadhar_no: location.state.aadhar_no,
          state: location.state.state,
          city: location.state.city,
          district: location.state.district,
          constituency: location.state.constituency,
          login_id: small_id,
          password: hashedPassword,
        };
        console.log(small_id);
        axios
          .post("http://localhost/Project/register.php", sendData)
          .then(() => {
            alert("Candidate registration SUCCESSFULL!");
          });
        emailjs
          .send(
            EMAILJS_SERVICE_ID,
            LOGIN_TEMPLATE_ID,
            login_credentials,
            EMAILJS_PUBLIC_KEY
          )
          .then((response) => {
            alert("LOGIN CREDENTIALS SENT SUCCESSFULLY!!", response);
          })
          .catch((error) => {
            alert(error);
          });
        history(`/login`);
      } else {
        alert("Ethereum wallet not detected. Please install MetaMask.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const party_present = (party_name) => {
    axios
      .post("http://localhost/Project/party_present.php", {
        party: party_name,
        state: location.state.state,
        city: location.state.city,
        district: location.state.district,
        constituency: location.state.constituency,
      })
      .then((response) => {
        if (response.data.Status == "YES") {
          return false;
        } else {
          return true;
        }
      });
  };

  return (
    <div>
      <div className="main-box">
        <form onSubmit={submitForm}>
          <div className="row">
            <div className="col-md-12 text-center">
              <h1>Register as Candidate</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">First Name</div>
            <div className="col-md-6">
              <input
                type="text"
                name="first_name"
                className="form-control"
                value={location.state ? location.state.first_name : ""}
                disabled
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">Last Name</div>
            <div className="col-md-6">
              <input
                type="text"
                name="last_name"
                className="form-control"
                value={location.state.last_name}
                disabled
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">Aadhar No</div>
            <div className="col-md-6">
              <input
                type="number"
                name="aadhar_no"
                className="form-control"
                value={location.state.aadhar_no}
                disabled
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">Email</div>
            <div className="col-md-6">
              <input
                type="email"
                name="email"
                className="form-control"
                value={location.state.email}
                disabled
              />
            </div>
          </div>

          <div className="row">
            <label htmlFor="patyselect">Choose a Party</label>
            <select
              id="partyselect"
              onChange={(e) => {
                setParty(e.target.value);
              }}
            >
              <option value="">Select a party</option>
              {partylist.map((party, index) => (
                <option key={index} value={party}>
                  {party}
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <div className="col-md-12 text-cener">
              <input
                type="submit"
                name="submit"
                value="Register"
                className="btn btn-success"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Candiate;
