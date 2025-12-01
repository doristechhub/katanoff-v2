"use client";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Lottie from "lottie-react";
import networkLost from "@/assets/animations/network-lost.json";

export default function NetworkLostOverlay() {
  const { networkErrMsg } = useSelector(({ common }) => common);
  // Lock body scroll when overlay is active
  useEffect(() => {
    if (networkErrMsg) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [networkErrMsg]);

  if (!networkErrMsg) return null;

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999] px-6 text-center overflow-hidden">
      <div className="w-64 h-64 sm:w-80 sm:h-80">
        <Lottie animationData={networkLost} loop={true} />
      </div>
      {/* Title */}
      <h2 className="mt-6 text-2xl sm:text-3xl font-semibold text-gray-800">
        {networkErrMsg || "No Internet Connection"}
      </h2>

      {/* Subtitle */}
      <p className="mt-3 text-gray-500 text-base sm:text-lg max-w-md">
        It looks like you’re offline. Please check your internet connection and
        try again.
      </p>

      {/* Reload button */}
      {/* <div className="mt-5">
                <PrimaryLinkButton onClick={() => window.location.reload()}>
                    Reload
                </PrimaryLinkButton>
            </div> */}
    </div>
  );
}
