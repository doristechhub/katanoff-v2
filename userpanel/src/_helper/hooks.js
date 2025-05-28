import { useCallback, useEffect, useState } from "react";

export const useWindowSize = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isLargeScreen: false,
    isXLargeScreen: false,
  });

  const [diamondScreenSize, setDiamondScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isLargeScreen: false,
    isXLargeScreen: false,
  });

  const handleResize = () => {
    setScreenSize({
      isMobile: window.innerWidth <= 767,
      isTablet: window.innerWidth <= 992 && window.innerWidth >= 567,
      isLaptop: window.innerWidth <= 2400 && window.innerWidth >= 992,
      isLargeScreen: window.innerWidth >= 2400 && window.innerWidth < 3200,
      isXLargeScreen: window.innerWidth >= 3200,
    });

    setDiamondScreenSize({
      isMobile: window.innerWidth <= 767,
      isTablet: window.innerWidth <= 992 && window.innerWidth >= 567,
      isLaptop: window.innerWidth <= 1800 && window.innerWidth >= 992, // Adjusted range for diamond
      isLargeScreen: window.innerWidth >= 1800 && window.innerWidth < 3200,
      isXLargeScreen: window.innerWidth >= 3200,
    });
  };

  useEffect(() => {
    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getColumns = useCallback(() => {
    if (screenSize?.isXLargeScreen) return 6;
    if (screenSize?.isLargeScreen) return 5;
    if (screenSize?.isLaptop) return 4;
    if (screenSize?.isTablet) return 3;
    if (screenSize?.isMobile) return 2;
    return 4; // Default for non-matching cases
  }, [
    screenSize?.isLaptop,
    screenSize?.isLargeScreen,
    screenSize?.isMobile,
    screenSize?.isTablet,
    screenSize?.isXLargeScreen,
  ]);

  const getDiamondColumns = useCallback(() => {
    if (diamondScreenSize?.isXLargeScreen) return 7;
    if (diamondScreenSize?.isLargeScreen) return 6;
    if (diamondScreenSize?.isLaptop) return 6; // Reflect the changed range here
    if (diamondScreenSize?.isTablet) return 4;
    if (diamondScreenSize?.isMobile) return 3;
    return 6; // Default for non-matching cases
  }, [
    diamondScreenSize?.isLaptop,
    diamondScreenSize?.isLargeScreen,
    diamondScreenSize?.isMobile,
    diamondScreenSize?.isTablet,
    diamondScreenSize?.isXLargeScreen,
  ]);

  const columnCount = getColumns();
  const diamondColumnCount = getDiamondColumns();

  return { ...screenSize, columnCount, diamondColumnCount };
};

