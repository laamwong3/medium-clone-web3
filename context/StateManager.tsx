import React, { createContext, useContext, useState } from "react";

interface StateManagerProps {
  children: React.ReactNode;
}

interface StatesTypes {
  isUploadingToIpfs: boolean;
  setIsUploadingToIpfs: React.Dispatch<React.SetStateAction<boolean>>;
}

const StateStore = createContext({} as StatesTypes);

const StateManager = ({ children }: StateManagerProps) => {
  const [isUploadingToIpfs, setIsUploadingToIpfs] = useState(false);

  return (
    <StateStore.Provider
      value={{
        isUploadingToIpfs,
        setIsUploadingToIpfs,
      }}
    >
      {children}
    </StateStore.Provider>
  );
};

export default StateManager;
export const useStateAPI = () => useContext(StateStore);
