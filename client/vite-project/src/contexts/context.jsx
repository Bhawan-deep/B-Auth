import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [userdata, SetUserData] = useState(null);
  const [isLoggedIn, SetisLoggedIn] = useState("false");

  // Fetch user profile
  const getUserData = async () => {
    try {
      const resp = await axios.get(`${backendUrl}/User/profile`, {
        withCredentials: true,
      });

      console.log("getUserData called", resp.data);

      if (resp.data.success) {
        SetUserData(resp.data);
        console.log("User data fetched");
      } else {
        console.log("User fetch failed");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Check login status
  const getAuthState = async () => {
    try {
      const resp = await axios.get(`${backendUrl}/AuthApi/is-Auth`, {
        withCredentials: true,
      });

      if (resp.data.success) {
        SetisLoggedIn("true");
        await getUserData();
      } else {
        SetisLoggedIn("false");
        SetUserData(null);
      }
    } catch (err) {
      console.error("Error checking auth state:", err);
      SetisLoggedIn("false");
      SetUserData(null);
    }
  };

  // Run on first render
  useEffect(() => {
    getAuthState();
  }, []);

  // Exposed context values
  const values = {
    userdata,
    SetUserData,
    isLoggedIn,
    SetisLoggedIn,
    backendUrl,
    getUserData,
  };

  return (
    <UserContext.Provider value={values}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
