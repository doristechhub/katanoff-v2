import Link from "next/link";
import {  VerifyOTPForm } from "@/components/dynamiComponents";
import verifyOtp from "@/assets/images/auth/verify-otp.webp";
import textLogo from "@/assets/images/logo-text.webp";
import CustomImg from "@/components/ui/custom-img";

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
            <CustomImg
              srcAttr={textLogo}
              altAttr="lab grown diamond jewelry, custom jewelry, fine jewelry, ethical diamond jewelry, engagement rings, wedding rings, tennis bracelets, diamond earrings, diamond necklaces, pendants, men’s jewelry, New York, USA, Katanoff"
              titleAttr="Katanoff | Lab Grown Diamond & Custom Fine Jewelry in New York"
              className="w-40 md:w-52 lg:w-70"
            />
          </Link>
          <VerifyOTPForm />
        </div>
      </div>
    </div>
  );
};

export default VeriftOTP;
