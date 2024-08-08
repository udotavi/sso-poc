// src/ApiCall.js

import React, { useState } from "react";

import { jwtDecode } from "jwt-decode";
import { loginRequest } from "./authConfig";
import { useMsal } from "@azure/msal-react";
import { useRef } from "react";

const ApiCall = () => {
  const [accessToken, setAccessToken] = useState("");
  const [rawToken, setRawToken] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const [endpointInput, setEndpointInput] = useState("");
  const { accounts, instance } = useMsal();
  const apiEndpoint = useRef();

  const getToken = async () => {
    const activeAccount = accounts[0];
    const accessTokenRequest = {
      ...loginRequest,
      account: activeAccount,
    };
    const tokenResponse = await instance.acquireTokenSilent(accessTokenRequest);
    const accessToken = tokenResponse.accessToken;
    return accessToken;
  };

  const callApi = async () => {
    const accessToken = await getToken();
    setApiResponse("");
    setRawToken(accessToken);

    const decodedToken = jwtDecode(accessToken);
    setAccessToken(JSON.stringify(decodedToken, null, 2));

    const url = apiEndpoint.current.value;

    try {
      console.log(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`, // Bearer token in the Authorization header
          "Content-Type": "application/json",
        },
      });

      setApiResponse(response.status);
    } catch {
      console.log("Error!");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter API Endpoint"
        value={endpointInput}
        onChange={(e) => setEndpointInput(e.target.value)}
        style={{ minWidth: "50vw" }}
        ref={apiEndpoint}
      ></input>
      {endpointInput && <button onClick={callApi}>Call API</button>}
      {accessToken && (
        <>
          {apiResponse && <p>API Response Status: {apiResponse}</p>}

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
          <div>
            <h5>Raw Token:</h5>
            <span>{rawToken}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default ApiCall;
