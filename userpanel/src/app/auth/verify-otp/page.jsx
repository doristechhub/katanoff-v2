import Link from "next/link";
import { CustomImg, VerifyOTPForm } from "@/components/dynamiComponents";
import verifyOtp from "@/assets/images/auth/verify-otp.webp";
import textLogo from "@/assets/images/logo-text.webp";

const VeriftOTP = () => {
  return (
    <div className="flex lg:flex-row h-screen">
      {/* Left Side */}
      <div className="lg:block hidden w-full lg:w-3/5 h-screen">
        <CustomImg srcAttr={verifyOtp} className="w-full h-full" priority />
      </div>

      {/* Right Side */}
      <div className="w-full h-full lg:w-1/2 flex items-center lg:justify-between px-4 py-12 md:px-32 md:py-52 lg:p-[75px_100px_75px_22px]">
        <div className="flex flex-col justify-center gap-10 md:gap-24 lg:justify-between w-full lg:h-full">
          <Link href={"/"} className="flex justify-center">
            <CustomImg srcAttr={textLogo} className="w-40 md:w-52 lg:w-70" />
          </Link>
          <VerifyOTPForm />
        </div>
      </div>
    </div>
  );
};

export default VeriftOTP;
