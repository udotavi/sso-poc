// src/LoginButton.js

import React from "react";
import { loginRequest } from "./authConfig";
import { useMsal } from "@azure/msal-react";

const LoginButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e) => {
      console.error(e);
    });
  };

  return <button onClick={handleLogin}>Login</button>;
};

export default LoginButton;
