import Lottie from "lottie-react";
import primaryLoader from "@/assets/animations/primary-loader.json";
import whiteLoader from "@/assets/animations/white-loader.json";

const Spinner = ({ className, loaderType = "" }) => {
  let selectedLoader = primaryLoader;

  if (loaderType === "white") {
    selectedLoader = whiteLoader;
  }

  return (
    <Lottie
      loop={true}
      animationData={selectedLoader}
      className={`h-10 ${className}`}
    />
  );
};

export default Spinner;
