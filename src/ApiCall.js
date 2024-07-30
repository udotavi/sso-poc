// src/ApiCall.js

import React, { useState } from "react";

import { jwtDecode } from "jwt-decode";
import { loginRequest } from "./authConfig";
import { useMsal } from "@azure/msal-react";

const ApiCall = () => {
  const { accounts, instance } = useMsal();
  const [accessToken, setAccessToken] = useState("");
  const [rawToken, setRawToken] = useState("");

  const callApi = () => {
    console.log("Calling API..");
    const activeAccount = accounts[0];
    const accessTokenRequest = {
      ...loginRequest,
      account: activeAccount,
    };

    instance
      .acquireTokenSilent(accessTokenRequest)
      .then((response) => {
        const accessToken = response.accessToken;
        setRawToken(accessToken);
        const decodedToken = jwtDecode(accessToken);
        setAccessToken(JSON.stringify(decodedToken, null, 2));
      })
      .catch((error) => {
        console.error("Error acquiring access token:", error);
      });
  };

  return (
    <div>
      <button onClick={callApi}>Call API</button>
      {accessToken && (
        <>
          <p>Calling backend api - https://my-example-api.com/api/cars</p>
          <div>
            <h5>Raw Token:</h5>
            <span>{rawToken}</span>
          </div>
          <div>
            <h5>Access Token Used:</h5>
            <pre
              style={{
                background: "#f5f5f5",
                color: "blue",
                padding: "10px",
                borderRadius: "5px",
                overflow: "auto",
              }}
            >
              <code>{accessToken}</code>
            </pre>
          </div>
        </>
      )}
    </div>
  );
};

export default ApiCall;
