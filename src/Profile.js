// src/Profile.js

import React, { useEffect, useState } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

import AdminComponent from "./AdminComponent";
import ApiCall from "./ApiCall";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import UserComponent from "./UserComponent";
import { jwtDecode } from "jwt-decode";
import { loginRequest } from "./authConfig";

const Profile = () => {
  const { accounts, instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const activeAccount = accounts[0];
      const accessTokenRequest = {
        ...loginRequest,
        account: activeAccount,
      };

      instance
        .acquireTokenSilent(accessTokenRequest)
        .then((response) => {
          const accessToken = response.accessToken;
          const decodedToken = jwtDecode(accessToken);
          const role = decodedToken.roles
            ? decodedToken.roles[0]
            : "No role available";
          setUserRole(role);
        })
        .catch((error) => {
          console.error("Error acquiring access token:", error);
        });
    }
  }, [isAuthenticated, accounts, instance]);

  if (!isAuthenticated) {
    return (
      <div>
        <p>Please log in.</p>
        <LoginButton />
      </div>
    );
  }

  const userAccount = accounts[0];

  return (
    <div>
      <h2>Welcome, {userAccount.name}</h2>
      <div>Email: {userAccount.username}</div>
      <div>Role: {userRole}</div>
      <br></br>
      <LogoutButton />
      <hr></hr>
      {userRole === "admin" && <AdminComponent />}
      {["user", "admin"].includes(userRole) && <UserComponent />}
      <br></br>
      <ApiCall />
    </div>
  );
};

export default Profile;
