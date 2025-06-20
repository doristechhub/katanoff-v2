import centerStone from "@/assets/images/home/center-stone.webp";
import ringSetting from "@/assets/images/home/ring-setting.webp";
import centerStoneVideo from "@/assets/images/home/center-stone-video.gif";
import centerStoneCombine from "@/assets/images/home/center-stone-combine.webp";
import { CustomImg } from "../dynamiComponents";
import { PrimaryLinkButton } from "./button";

const RingSettingCenterStone = () => {
  return (
    <>
      {/* <div className="hidden md:block container">
        <div className="grid grid-cols-3">
          <CommonSectionContent
            image={ringSetting}
            title="Ring Setting"
            description="Elevate your love story with our exquisite collection of engagement ring designs"
            buttonText="Start With Setting"
            href="/"
          />
          <div>
            <video
              muted
              preload="none"
              aria-label="Video player"
              playsInline
              autoPlay
              loop
              className="h-full w-full object-cover overflow-hidden"
            >
              <source src="/videos/center-stone-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <CommonSectionContent
            image={centerStone}
            title="Center Stone"
            description="Explore our stunning diamond collection and discover the brilliance in every choice."
            buttonText="Start With Stone"
            href="/"
          />
        </div>
      </div> */}
      <div className="hidden md:block container">
        <div className="relative grid grid-cols-2 xl:grid-cols-3 items-start">
          {/* Left Content */}
          <CommonSectionContent
            image={ringSetting}
            title="Ring Setting"
            description="Elevate your love story with our exquisite collection of engagement ring designs"
            buttonText="Start With Setting"
            href="/"
          />

          {/* Center GIF with overlap */}
          <div className="hidden xl:relative xl:flex justify-center -mt-10 h-full w-full">
            <CustomImg
              srcAttr={centerStoneVideo}
              altAttr="Center Stone Animation"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Right Content */}
          <CommonSectionContent
            image={centerStone}
            title="Center Stone"
            description="Explore our stunning diamond collection and discover the brilliance in every choice."
            buttonText="Start With Stone"
            href="/"
          />
        </div>
        <div className="xl:hidden">
          <div className=" h-full w-full flex justify-center">
            <CustomImg
              srcAttr={centerStoneVideo}
              altAttr="Center Stone Animation"
              className="w-[90%] h-auto object-contain"
            />
          </div>
        </div>
      </div>

      <div className="container md:hidden">
        <div className="flex flex-col items-center gap-4 text-center justify-center">
          <CustomImg
            srcAttr={centerStoneCombine}
            altAttr="Center Stone"
            className="w-52 h-20 xss:w-60 xss:h-24 sm:w-72 sm:h-32"
          />
          <h2 className="text-3xl sm:text-4xl font-semibold font-castoro uppercase text-black w-[80%]">
            Design Your Ring
          </h2>
          <p>Build Your Ring in 2 Step's</p>
          <div className="flex justify-center">
            <PrimaryLinkButton
              variant="blackHover"
              className="!uppercase !rounded-none"
              href={"/customize/select-diamond"}
            >
              start With Diamond
            </PrimaryLinkButton>
          </div>
          <div className="h-full w-full">
            <CustomImg
              srcAttr={centerStoneVideo}
              altAttr="Center Stone Animation"
              className="w-full h-auto object-cover"
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
        <CustomImg
          srcAttr={image}
          altAttr="Center Stone"
          className="w-full h-auto md:w-28 md:h-28 xl:w-36 xl:h-36"
        />
        <div className="flex flex-col gap-6 justify-center items-center text-center pt-2 xl:pt-6">
          <p className="text-3xl lg:text-4xl 2xl:text-5xl font-bold uppercase text-black">
            {title}
          </p>
          <p className="w-[80%]">{description}</p>
        </div>
        <div className="flex justify-center mt-2 2xl:mt-4">
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
