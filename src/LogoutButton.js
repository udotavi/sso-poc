import { useMsal } from "@azure/msal-react";

const LogoutButton = () => {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutRedirect().catch((error) => {
      console.error("Logout error:", error);
    });
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
