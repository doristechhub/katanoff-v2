import Lottie from "lottie-react";
import primaryLoader from "@/assets/animations/primary-loader.json";
import whiteLoader from "@/assets/animations/white-loader.json";
import pleaseWaitLoader from "@/assets/animations/please-wait-loader.json";

const Spinner = ({ className, loaderType = "" }) => {
  let selectedLoader = primaryLoader;
  loaderType = loaderType;
  if (loaderType === "white") {
    selectedLoader = whiteLoader;
  } else if (loaderType === "pleaseWait") {
    selectedLoader = pleaseWaitLoader;
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
