import Link from "next/link";
import { LoginForm } from "@/components/dynamiComponents";
import login from "@/assets/images/auth/login.webp";
import textLogo from "@/assets/images/logo-text.webp";
import CustomImg from "@/components/ui/custom-img";

const Login = () => {
  return (
    <div className="flex lg:flex-row h-screen">
      <h1 className="hidden">Login</h1>

      {/* Left Side */}
      <div className="lg:block hidden w-full lg:w-3/5 h-screen">
        <CustomImg srcAttr={login} className="w-full h-full" />
      </div>

      {/* Right Side */}
      <div className="w-full h-full lg:w-1/2 flex items-center lg:justify-between px-4 py-12 md:px-32 md:py-52 lg:p-[75px_100px_75px_22px]">
        <div className="flex flex-col justify-center lg:justify-between w-full lg:h-full">
          <Link href={"/"} className="flex justify-center">
            <CustomImg
              srcAttr={textLogo}
              altAttr="lab grown diamond jewelry, custom jewelry, fine jewelry, ethical diamond jewelry, engagement rings, wedding rings, tennis bracelets, diamond earrings, diamond necklaces, pendants, men’s jewelry, New York, USA, Katanoff"
              titleAttr="Katanoff | Lab Grown Diamond & Custom Fine Jewelry in New York"
              className="w-40 md:w-60 lg:w-70 2xl:w-80 "
            />
          </Link>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
