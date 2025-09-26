"use client";
import centerStone from "@/assets/images/home/center-stone.webp";
import ringSetting from "@/assets/images/home/ring-setting.webp";
import centerStoneVideo from "@/assets/images/home/center-stone-video.gif";
import centerStoneCombine from "@/assets/images/home/center-stone-combine.webp";
import { PrimaryLinkButton } from "./button";
import { PAGE_IMG_ALT_TITLE } from "@/_helper/pageImgAltTitle";
import { PAGE_CONSTANTS } from "@/_helper";
import CustomImg from "./custom-img";

const RingSettingCenterStone = () => {
  return (
    <>
      <div className="hidden md:block container">
        <div className="grid grid-cols-2 xl:grid-cols-3 ">
          {/* Left Content */}
          <CommonSectionContent
            image={ringSetting}
            altAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].alt}
            titleAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].title}
            title="Choose Your Setting"
            description="Design your perfect ring starting with a setting crafted to reflect your style."
            buttonText="Explore Settings"
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
            altAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].alt}
            titleAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.HOME].title}
            title="Select Your Diamond"
            description="Discover our curated diamond selection and find the centerpiece that tells your story."
            buttonText="Explore Diamonds"
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
        <div className="flex flex-col items-center gap-2 text-center justify-center">
          <CustomImg
            srcAttr={centerStoneCombine}
            altAttr="Center Stone"
            className="w-[80%]"
          />
          <h2 className="text-xl font-semibold font-gelasio uppercase text-black w-[80%] mt-3">
            Personalize Your Ring
          </h2>
          <p className="text-sm">
            Create a ring that tells your story — crafted in 3 simple steps.
          </p>
          <div className="flex justify-center mt-2">
            <PrimaryLinkButton
              variant="blackHover"
              className="!uppercase !rounded-none"
              href={"/customize/select-diamond"}
            >
              Start Designing
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
  altAttr,
  titleAttr,
  title,
  description,
  buttonText,
  href,
}) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 2xl:gap-6">
        <CustomImg srcAttr={image} altAttr={altAttr} titleAttr={titleAttr} />
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
