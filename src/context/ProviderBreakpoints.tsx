// src/context/BreakpointContext.tsx
import { useMediaQuery } from "@uidotdev/usehooks";
import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

type BreakpointContextType = {
  isSmallDevice: boolean;
  isMediumDevice: boolean;
  isLargeDevice: boolean;
  isExtraLargeDevice: boolean;
};

const BreakpointContext = createContext<BreakpointContextType | null>(null);

export const BreakpointProvider = ({ children }: { children: ReactNode }) => {
  
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const isMediumDevice = useMediaQuery(
    "only screen and (min-width : 769px) and (max-width : 992px)"
  );
  const isLargeDevice = useMediaQuery(
    "only screen and (min-width : 993px) and (max-width : 1200px)"
  );
  const isExtraLargeDevice = useMediaQuery(
    "only screen and (min-width : 1201px)"
  );

  const value = useMemo(
    () => ({
      isSmallDevice,
      isMediumDevice,
      isLargeDevice,
      isExtraLargeDevice,
    }),
    [isSmallDevice, isMediumDevice, isLargeDevice, isExtraLargeDevice]
  );

  return (
    <BreakpointContext.Provider value={value}>
      {children}
    </BreakpointContext.Provider>
  );
};

export const useBreakpoints = () => {
  const context = useContext(BreakpointContext);
  if (!context)
    throw new Error("useBreakpoints must be used within BreakpointProvider");
  return context;
};
