import React, { useState } from "react";
import axios from "axios";

const Login = (props) => {
    const [dbCand,setdbCand] = useState([]);
    const handleClick = ()=>{
        props.connectWallet();
       

    };
    return (
        <div className="login-container">
            <h1 className="welcome-message">Welcome to the Ballot</h1>
            <button className="login-button" onClick = {handleClick}>Login</button>
        </div>
    )
}

export default Login;