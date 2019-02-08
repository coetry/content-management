import React, { useState, useEffect, createContext } from "react";
import { Stitch } from "mongodb-stitch-browser-sdk";

const StitchContext = createContext();

const StitchProvider = ({ children }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    const client = Stitch.initializeAppClient("content-management-mkiko");
    setState({
      client,
      user: client.auth.user,
      isLoggedIn: client.auth.isLoggedIn
    });
  }, []);

  return (
    <StitchContext.Provider value={{ state, setState }}>
      {children}
    </StitchContext.Provider>
  );
};

export { StitchContext, StitchProvider };
