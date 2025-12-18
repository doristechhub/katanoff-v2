import Link from "next/link";
import { SignUpForm } from "@/components/dynamiComponents";
import signUpImg from "@/assets/images/auth/sign-up.webp";
import CustomImg from "@/components/ui/custom-img";

const SignUp = () => {
  return (
    <div className="flex lg:flex-row">
      {/* Left Side */}
      <h1 className="hidden">Signup</h1>
      <div className="lg:block hidden w-full lg:w-3/5 h-screen">
        <CustomImg srcAttr={signUpImg} className="w-full h-full" />
      </div>

      {/* Right Side */}
      <div className="w-[90%] md:w-[70%] lg:w-1/2 mx-auto h-screen flex items-center lg:justify-center">
        <div className="lg:-ms-[15%] flex flex-col justify-center gap-6 md:gap-10 lg:gap-5 lg:justify-center w-full lg:h-full lg:py-10">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
