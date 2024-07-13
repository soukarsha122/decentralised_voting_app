import React from 'react'
import { useState, useEffect } from "react";

import { contractAbi, contractAddress } from "./Constant/constant";

const ethers = require("ethers");




const Partylist = () => {

    const partylist = ["P_A", "P_B", "P_C", "P_D"];
   

  return (
    
      <div className="row">
            <label htmlFor="patyselect">Choose a Party</label>
            <select id="partyselect">
              <option value="">Select a party</option>
              {partylist.map((party, index) => (
                <option key={index} value={party}>
                  {party}
                </option>
              ))}
            </select>
        </div>

    
  )
}

export default Partylist
