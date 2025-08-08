import centerStone from "@/assets/images/home/center-stone.webp";
import ringSetting from "@/assets/images/home/ring-setting.webp";
import centerStoneVideo from "@/assets/images/home/center-stone-video.gif";
import centerStoneCombine from "@/assets/images/home/center-stone-combine.webp";
import { CustomImg } from "../dynamiComponents";
import { PrimaryLinkButton } from "./button";

const RingSettingCenterStone = () => {
  return (
    <>
      <div className="hidden md:block container">
        <div className="grid grid-cols-2 xl:grid-cols-3 ">
          {/* Left Content */}
          <CommonSectionContent
            image={ringSetting}
            title="Ring Setting"
            description="Elevate your love story with our exquisite collection of engagement ring designs"
            buttonText="Start With Setting"
            href="/customize/select-diamond"
          />

          {/* Center GIF with overlap */}

          <div className="hidden h-[80vh] 2xl:h-[90vh] w-full xl:flex justify-center p-0 m-0 aspect-video -mt-[10%]">
            <video
              className="w-full h-full object-contain border-0 outline-0"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/videos/center-stone.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Right Content */}
          <CommonSectionContent
            image={centerStone}
            title="Center Stone"
            description="Explore our stunning diamond collection and discover the brilliance in every choice."
            buttonText="Start With Stone"
            href="/customize/select-diamond"
          />
        </div>
        <div className="xl:hidden">
          <div className=" h-[600px] w-full flex justify-center">
            <video
              className="w-full h-full object-contain"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={"/videos/center-stone.mp4"} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>

      <div className="container md:hidden">
        <div className="flex flex-col items-center gap-4 text-center justify-center">
          <CustomImg
            srcAttr={centerStoneCombine}
            altAttr="Center Stone"
            className=""
          />
          <h2 className="text-3xl sm:text-4xl font-semibold font-castoro uppercase text-black w-[80%]">
            Design Your Ring
          </h2>
          <p>Build Your Ring in 3 Step's</p>
          <div className="flex justify-center">
            <PrimaryLinkButton
              variant="blackHover"
              className="!uppercase !rounded-none"
              href={"/customize/select-diamond"}
            >
              start With Diamond
            </PrimaryLinkButton>
          </div>
          <div className="h-[400px] xss:h-[500px] xs:h-[600px] w-full flex justify-center">
            <CustomImg
              srcAttr={centerStoneVideo}
              altAttr="Center Stone Animation"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RingSettingCenterStone;

const CommonSectionContent = ({
  image,
  title,
  description,
  buttonText,
  href,
}) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 2xl:gap-6">
        <CustomImg srcAttr={image} altAttr="Center Stone" className="" />
        <div className="flex flex-col gap-4 justify-center items-center text-center pt-2 xl:pt-4">
          <p className="text-2xl lg:text-3xl font-bold uppercase text-black">
            {title}
          </p>
          <p className="w-[80%]">{description}</p>
        </div>
        <div className="flex justify-center mt-2">
          <PrimaryLinkButton
            variant="blackHover"
            className="!uppercase !rounded-none"
            href={href}
          >
            {buttonText}
          </PrimaryLinkButton>
        </div>
      </div>
    </>
  );
};
