import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          const response = await axios.get(
            "http://localhost:8000/api/userprofile/",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setCurrentUser(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    setCurrentUser,
    logout,
  };

  if (loading) {
    return (
      <div className="absolute flex right-[50%] bottom-[50%] justify-center">
        <ClipLoader color={"#000"} size={100} />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
