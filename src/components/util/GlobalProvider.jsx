import { GlobalContext, initGlobalState } from "../../context";
import React, { useState } from "react";

export const GlobalProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState(initGlobalState);

  return (
    <GlobalContext.Provider
      value={{
        globalState,
        setGlobalState,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
