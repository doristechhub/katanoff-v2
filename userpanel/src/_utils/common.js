export const capitalizeWords = (str) =>
  str
    ?.split("-") // Handle kebab-case by splitting on "-"
    ?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1)) // Capitalize each word
    ?.join(" ");

export const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const phoneRegex =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const generateCurrentTimeAndDate = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 19) + "+00:00";
  return formattedDate;
};

export const roundedBorder =
  "rounded-tl-xl rounded-tr-xl 2xl:rounded-tl-[30px] 2xl:rounded-tr-[30px]";

// Animation Variations
export const rightToLeftAnimation = {
  hidden: { opacity: 0, x: 50 }, // Start from the right
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

export const leftToRightAnimation = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

export const cardAnimation = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
};

export const ITEMS_PER_PAGE = 12;
