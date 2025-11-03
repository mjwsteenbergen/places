import {
  createContext,
  type FunctionComponent,
  useState,
  useContext,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { OfState } from "~/context/mapbox-gl";

const SideMenuContext = createContext<
  [boolean, Dispatch<SetStateAction<boolean>>] | undefined
>(undefined);

export const SideMenuContextProvider: FunctionComponent<{
  children: ReactNode;
  value: [boolean, Dispatch<SetStateAction<boolean>>];
}> = ({ children, value }) => {
  return (
    <SideMenuContext.Provider value={value}>
      {children}
    </SideMenuContext.Provider>
  );
};

export const useSideMenu = () => {
  const s = useContext(SideMenuContext);
  if (s === undefined) {
    throw new Error(
      "SideMenuContext must be used within a SideMenuContextProvider"
    );
  }
  return s;
};
