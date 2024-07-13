import axios from "axios";

import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";

import React, { useRef, useState } from "react";

const Login = () => {
  let navigate = useNavigate();

  const confirmnewpassref = useRef(null);
  const newpassref = useRef(null);
  const emailref = useRef(null);

  const [user, setUser] = useState({ login_id: "", password: "" });
  const [hashedPassword, setHashedPassword] = useState("");
  const [displayLoginButton, setDisplayLoginButton] = useState(true);
  const [displayChangePasswordButton, setDisplayChangePasswordButton] =
    useState(true);
  const [displayForgotLoginButton, setDisplayForgotLoginButton] =
    useState(true);
  const [displayOldPassButton, setDisplayOldPassButton] = useState(false);
  const [displayNewLoginButton, setDisplayNewLoginButton] = useState(false);

  const [disableLoginButton, setDisableLoginButton] = useState(false);
  const [disableChangePasswordButton, setDisableChangePasswordButton] =
    useState(false);
  const [disableForgotLoginButton, setDisableForgotLoginButton] =
    useState(false);
  const [disableEnterLoginButton, setDisableEnterLoginButton] = useState(false);
  const [disableEnterPassButton, setDisableEnterPassButton] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const submitForm = (e) => {
    e.preventDefault();
    const sendData = {
      login_id: user.login_id,
      password: user.password,
    };

    axios
      .post("http://localhost/Project/login.php", sendData)
      .then((result) => {
        console.log(result);
        if (result.data.Status === "200") {
          navigate("/voting", {
            state: {
              login: sendData.login_id,
              state: result.data.state,
              city: result.data.city,
              district: result.data.district,
              constituency: result.data.constituency,
            },
          });
        } else {
          alert("User not registered");
          navigate("/register");
        }
      });
  };

  const sendLoginId = () => {
    const sendData = { email: emailref.current.value };
    axios
      .post("http://localhost/Project/getByEmail.php", sendData)
      .then((response) => {
        if (response.data.exists != "true") {
          alert("There is no account registered with this email");
        } else {
          console.log(response.data.login_id);
          //emailjs
          alert("Login id sent to registered email successfully");
          setDisplayNewLoginButton(false);
          setDisableChangePasswordButton(false);
          setDisableEnterLoginButton(false);
          setDisableEnterPassButton(false);
          setDisableForgotLoginButton(false);
          setDisableLoginButton(false);
        }
      });
  };

  const submitnewPass = async () => {
    const entered_pass = newpassref.current.value;
    const confirmed_pass = confirmnewpassref.current.value;
    if (entered_pass != confirmed_pass) {
      alert(
        "Entered password and Confirmed password donot match\nRenter correctly"
      );
      newpassref.current.value = "";
      confirmnewpassref.current.value = "";
      return;
    }
    console.log(entered_pass);
    let newPassword = "";
    try {
      newPassword = await bcrypt.hash(entered_pass, 10);
      console.log("Now pass is ", newPassword);
    } catch (err) {
      console.error("Error hashing password:", err);
    }
    console.log("Now pass is ", newPassword);
    const sendData = { password: newPassword, login_id: user.login_id };
    console.log(sendData);
    axios
      .post("http://localhost/Project/updatePassword.php", sendData)
      .then((response) => {
        console.log(response);
        if (response.data.Status == "Done") {
          alert("Password Updated Successfully");
        } else if (response.data.Status == "Incorrect Login Id")
          alert("Invlaid Login Id");
        else alert(response.data.Message);
      })
      .then(() => {
        setDisplayOldPassButton(false);
        setDisableChangePasswordButton(false);
        setDisableEnterLoginButton(false);
        setDisableEnterPassButton(false);
        setDisableForgotLoginButton(false);
        setDisableLoginButton(false);
      });
  };

  return (
    <form onSubmit={submitForm}>
      <div className="main-box">
        <div className="row">
          <div className="col-md-12 text-center">
            <h1>Login Page</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">Login id:</div>
          <div className="col-md-6">
            <input
              type="text"
              name="login_id"
              onChange={handleChange}
              disabled={disableEnterLoginButton}
              value={user.login_id}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">Password:</div>
          <div className="col-md-6">
            <input
              type="text"
              name="password"
              onChange={handleChange}
              disabled={disableEnterPassButton}
              value={user.password}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 text-center">
            <input
              type="button"
              name="submit"
              className="btn btn-success"
              value="Login"
              onClick={submitForm}
              disabled={disableLoginButton}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-center">
            <input
              type="button"
              name="submit"
              className="btn btn-success"
              value="Forgot Password"
              onClick={() => {
                if (user.login_id != "") {
                  setDisplayOldPassButton(true);
                  setDisableChangePasswordButton(true);
                  setDisableEnterLoginButton(true);
                  setDisableEnterPassButton(true);
                  setDisableForgotLoginButton(true);
                  setDisableLoginButton(true);
                } else {
                  alert("Enter login id please !!!");
                }
              }}
              disabled={disableChangePasswordButton}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-center">
            <input
              type="button"
              name="submit"
              className="btn btn-success"
              value="Forgot Login Id"
              onClick={() => {
                setDisplayNewLoginButton(true);
                setDisableChangePasswordButton(true);
                setDisableEnterLoginButton(true);
                setDisableEnterPassButton(true);
                setDisableForgotLoginButton(true);
                setDisableLoginButton(true);
              }}
              disabled={disableForgotLoginButton}
            />
          </div>
        </div>
        <div style={{ display: displayNewLoginButton ? "block" : "none" }}>
          <div className="row">
            <div className="col-md-6">Email</div>
            <div className="col-md-6">
              <input
                type="email"
                name="email"
                className="form-control"
                ref={emailref}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 text-center">
              <input
                type="button"
                name="submit"
                className="btn btn-success"
                value="Send Login id"
                onClick={sendLoginId}
              />
            </div>
          </div>
        </div>

        <div style={{ display: displayOldPassButton ? "block" : "none" }}>
          <div className="row">
            <div className="col-md-6">Enter New Password:</div>
            <div className="col-md-6 ">
              <input
                type="text"
                name="enternewpass"
                className="form-control"
                ref={newpassref}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">Confirm New Password:</div>
            <div className="col-md-6 ">
              <input
                type="text"
                name="confirmnewpass"
                className="form-control"
                ref={confirmnewpassref}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 text-center">
              <input
                type="button"
                name="submit"
                className="btn btn-success"
                value="Submit new Password"
                onClick={submitnewPass}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
