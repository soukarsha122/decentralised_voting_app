import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";

const Register = (props) => {
  let history = useNavigate(); // Use for Navigate on Previous
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    // password: "",
    aadhar_no: 0,
    state: "",
    city: "",
    district: "",
    constituency: "",
  });
  const [otp, setotp] = useState(-1);
  const isInitialRender = useRef(true);
  const [otpInput, setotpInput] = useState(false);
  const [a_data, seta_Data] = useState({
    name: "",
    email: "",
  });
  const [registerIp, setregisterIp] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    console.log(data);
  };

  const unique_id = uuid();
  const [hashedPassword, setHashedPassword] = useState("");
  const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
  const LOGIN_TEMPLATE_ID = process.env.REACT_APP_LOGIN_TEMPLATE_ID;

  // Get first 8 characters using slice
  const small_id = unique_id.slice(0, 8);
  const password =
    data.first_name.substring(0, 4) + data.aadhar_no.toString().substring(0, 4);
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return;
    }
    setHashedPassword(hashedPassword);
  });

  const submitForm = (e) => {
    e.preventDefault();
    const sendData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      aadhar_no: data.aadhar_no,
      state: data.state,
      city: data.city,
      district: data.district,
      constituency: data.constituency,
      login_id: small_id,
      password: hashedPassword,
    };

    axios
      .post("http://localhost/Project/register.php", sendData)
      .then((result) => {
        const inputs = document.querySelectorAll('input:not([type="submit"])');
        inputs.forEach((input) => (input.value = ""));
        console.log(result);
        if (result.data.data.status === "invalid") {
          alert("Already REGISTERED");
          history(`/login`);
        } else {
          alert("REGISTRATION SUCCESSFULL!!");
          const login_credentials = {
            to_name: data.first_name,
            message: `Login id is ${sendData.login_id} \n
                      Password is ${password}`,
            to_email: sendData.email,
            reply_to: "projectworkofficial.24@gmail.com",
          };
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
        }
      }); //int x
    // void f(){
    // int x}
  };

  const check_credentials = (sendInfo, receiveInfo) => {
    for (const key in sendInfo) {
      if (receiveInfo.hasOwnProperty(key) && sendInfo[key] !== "") {
        if (sendInfo[key] !== receiveInfo[key]) return false;
      }
    }
    return true;
  };

  const sendOTP = (mail_id, name) => {
    console.log(`Now otp value is ${otp}`);
    const template_params = {
      to_name: name,
      message: `${otp}`,
      to_email: mail_id,
      reply_to: "projectworkofficial.24@gmail.com",
    };
    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        template_params,
        EMAILJS_PUBLIC_KEY
      )
      .then((response) => {
        alert("OTP SENT SUCCESSFULLY!!", response);
      })
      .catch((error) => {
        alert("Error " + error);
      });
  };

  useEffect(() => {
    console.log(isInitialRender.current);
    if (!isInitialRender.current) {
      console.log(`Otp set to ${otp}`);
      sendOTP(a_data.email, a_data.name);
      setotpInput(true);
    }
  }, [otp]);

  const verifyDoc = (e) => {
    e.preventDefault();

    const sendInfo = { aadhar_no: data.aadhar_no };
    axios
      .post("http://localhost/Project/getInfo.php", sendInfo)
      .then((result) => {
        console.log(result);
        if (result.data.status === "valid") {
          if (check_credentials(data, result.data)) {
            const otp_random = Math.floor(100000 + Math.random() * 900000);
            setData((prevState) => ({
              ...prevState,
              state: result.data.regstate,
              city: result.data.city,
              district: result.data.district,
              constituency: result.data.constituency,
            }));
            console.log(
              `Random otp generated by verifydoc function is ${otp_random}`
            );
            seta_Data((prevState) => ({
              ...prevState,
              name: result.data.first_name,
              email: result.data.email,
            }));

            setotp(otp_random);
            isInitialRender.current = false;
          } else {
            alert("Credentials do not match with aadhar linked info");
            const inputs = document.querySelectorAll(
              'input:not([type="submit"])'
            );
            inputs.forEach((input) => (input.value = ""));
          }
        } else {
          alert(
            "No user with such Aadhar number found \n Please provide correct info"
          );
          const inputs = document.querySelectorAll(
            'input:not([type="submit"])'
          );
          inputs.forEach((input) => (input.value = ""));
        }
        // console.log(result);
      });
  };

  const verifyOTP = () => {
    const otpVal = document.getElementsByName("otp")[0].value;
    if (otpVal == otp) {
      alert("Otp Verification Successfull");
      setregisterIp(true);
    } else {
      alert("Invalid OTP!!!");
    }
  };

  const already_reg = () => {
    const sendData = {
      aadhar_no: data.aadhar_no,
    };
    axios
      .post("http://localhost/Project/alreadyReg.php", sendData)
      .then((result) => {
        const inputs = document.querySelectorAll('input:not([type="submit"])');
        inputs.forEach((input) => (input.value = ""));
        console.log(result);
        if (result.data.exists == "true") {
          alert("ALREADY REGISTERED");
          history("/login");
        } else {
          history("/candidate", { state: data });
        }
      });
  };

  const isValid_Aadhaar_Number = (aadhaar_number) => {
    // Regex to check valid
    // aadhaar_number
    let regex = new RegExp(/^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/);

    // if aadhaar_number
    // is empty return false
    if (aadhaar_number == null) {
      return "false";
    }

    // Return true if the aadhaar_number
    // matched the ReGex
    if (regex.test(aadhaar_number) == true) {
      return "true";
    } else {
      return "false";
    }
  };

  return (
    <div className="main-box">
      <form onSubmit={submitForm}>
        <div className="row">
          <div className="col-md-12 text-center">
            <h1>Register</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">First Name</div>
          <div className="col-md-6">
            <input
              type="text"
              name="first_name"
              className="form-control"
              onChange={handleChange}
              value={data.first_name}
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
              onChange={handleChange}
              value={data.last_name}
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
              onChange={handleChange}
              value={data.aadhar_no}
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
              onChange={handleChange}
              value={data.email}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 text-cener">
            <input
              type="button"
              name="verify"
              value="Verify"
              className="btn btn-success"
              onClick={verifyDoc}
            />
          </div>
        </div>
        <div
          className="further"
          style={{ display: otpInput ? "block" : "none" }}
        >
          <div className="row">
            <div className="col-md-6">Enter OTP</div>
            <div className="col-md-6">
              <input type="text" name="otp" className="form-control" />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 text-cener">
              <input
                type="button"
                name="submit"
                value="Verify OTP"
                className="btn btn-success"
                onClick={verifyOTP}
              />
            </div>
          </div>

          <div style={{ display: registerIp ? "block" : "none" }}>
            <div className="row">
              <div className="col-md-12 text-cener">
                <input
                  type="submit"
                  name="submit"
                  value="Register as Voter"
                  className="btn btn-success"
                />
              </div>
              <div className="col-md-12 text-cener">
                <input
                  type="button"
                  name="submit"
                  value="Register as Candidate"
                  className="btn btn-success"
                  onClick={already_reg}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
