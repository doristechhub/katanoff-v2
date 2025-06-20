import { CustomImg, ProgressiveImg } from "../dynamiComponents";
import { LinkButton } from "./button";

// Responsive Banners
import banner360W from "@/assets/images/home/banner-360w.webp";
import banner375W from "@/assets/images/home/banner-375w.webp";
import banner390W from "@/assets/images/home/banner-390w.webp";
import banner414W from "@/assets/images/home/banner-414w.webp";
import banner465W from "@/assets/images/home/banner-465w.webp";
import banner480W from "@/assets/images/home/banner-480w.webp";
import banner575W from "@/assets/images/home/banner-575w.webp";
import banner1366W from "@/assets/images/home/banner-1366w.webp";
import banner1920W from "@/assets/images/home/banner-1920w.webp";
import defaultBanner from "@/assets/images/home/default-banner.webp";

const HeroBanner = ({
  title,
  description,
  imageSrc,
  imageSrcDesktop,
  imageSrcMobile,
  videoSrc,
  textAlignment = "center",
  isHomePage = false,
  isStaticBanner = false,
  titleAttr = "",
  altAttr = "",
  customClass = " justify-center",
}) => {
  return (
    <section
      className={`relative overflow-hidden ${
        isHomePage ? "flex flex-col gap-10" : "h-auto"
      }`}
    >
      {isHomePage ? (
        <div className="w-full text-center">
          <picture>
            {/* Mobile Sources */}
            <source media="(max-width:360px)" srcSet={banner360W?.src} />
            <source media="(max-width:375px)" srcSet={banner375W?.src} />
            <source media="(max-width:390px)" srcSet={banner390W?.src} />
            <source media="(max-width:414px)" srcSet={banner414W?.src} />
            <source media="(max-width:465px)" srcSet={banner465W?.src} />
            <source media="(max-width:480px)" srcSet={banner480W?.src} />
            <source media="(max-width:575px)" srcSet={banner575W?.src} />

            {/* Desktop Sources */}
            <source media="(max-width:1366px)" srcSet={banner1366W?.src} />
            <source media="(max-width:1920px)" srcSet={banner1920W?.src} />

            {/* Fallback Image */}
            <CustomImg
              className="w-full h-auto object-cover"
              width="1920"
              height="1080"
              altAttr={altAttr || "Elegant diamond jewelry banner"}
              titleAttr={titleAttr}
              loading="eager"
              srcAttr={defaultBanner}
            />
          </picture>
        </div>
      ) : imageSrcDesktop || imageSrcMobile ? (
        <picture>
          {imageSrcMobile ? (
            <source media="(max-width: 1024px)" srcSet={imageSrcMobile} />
          ) : null}
          {imageSrcDesktop ? (
            <ProgressiveImg
              src={imageSrcDesktop}
              title={titleAttr}
              alt={altAttr}
              className="object-cover  w-full"
              progressiveImgClassName="h-[738px] lg:h-[448px] w-full"
            />
          ) : null}
        </picture>
      ) : imageSrc ? (
        <CustomImg
          srcAttr={imageSrc}
          altAttr={altAttr}
          titleAttr={titleAttr}
          priority
          className={`w-full ${
            isStaticBanner
              ? "object-cover h-[40vh] lg:h-auto"
              : isHomePage
              ? "object-cover h-full"
              : "h-[18vh] lg:h-auto"
          }`}
        />
      ) : (
        <video
          muted
          preload="none"
          aria-label="Video player"
          playsInline
          className="absolute top-0 left-0 w-full h-full"
          autoPlay
          loop
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {isHomePage ? (
        <>
          <div className="md:absolute md:inset-0 flex justify-center md:justify-normal items-center w-full my-6">
            <div className="md:w-[60%] lg:w-[45%] 2xl:w-[40%] text-baseblack md:text-white text-center">
              <h1 className="text-3xl 2xl:text-4xl font-medium leading-tight font-castoro">
                Diamonds that <br />
                Deserve You.
              </h1>
              <p className="mt-2 md:mt-2 text-sm">
                Free 1ct Diamond Pendant with Purchase<sup>*</sup>
              </p>
              <div className="mt-4 md:mt-4 flex flex-col md:flex-row items-center md:justify-center gap-2.5 md:gap-4">
                <LinkButton
                  href="/customize/start-with-setting"
                  className="lg:!h-0 w-fit lg:py-[16px] 2xl:py-[20px] 2xl:!min-w-[250px] lg:!text-sm !font-bold rounded-none !border-baseblack md:!border-white !border-1 !text-baseblack md:!text-white !bg-transparent hover:!bg-[#030817] hover:!text-white"
                >
                  SHOP ENGAGEMENT
                </LinkButton>
                <LinkButton
                  href="/collections/categories/Jewelry"
                  className="lg:!h-0 w-fit lg:py-[16px] 2xl:py-[20px] 2xl:!min-w-[250px] lg:!text-sm !font-bold rounded-none !border-baseblack md:!border-white !border-1 !text-baseblack md:!text-white !bg-transparent hover:!bg-[#030817] hover:!text-white"
                >
                  SHOP ALL JEWELRY
                </LinkButton>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className={`absolute inset-0 flex items-center p-4 ${customClass}`}
          >
            <div
              className={`flex flex-col items-${textAlignment} w-full 
    max-w-[90%] sm:max-w-[70%] lg:max-w-[60%] text-${textAlignment} md:gap-3`}
            >
              {title && description ? (
                <>
                  <h1 className="text-3xl md:text-5xl 2xl:text-6xl text-white font-castoro capitalize">
                    {title}
                  </h1>
                  {description && (
                    <p className="text-base md:text-lg text-white">
                      {description}
                    </p>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default HeroBanner;
