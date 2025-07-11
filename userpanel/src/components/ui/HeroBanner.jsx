import { CustomImg, ProgressiveImg } from "../dynamiComponents";
import { PrimaryLinkButton } from "./button";
import progressiveMobile from "@/assets/images/progressive-mobile.webp";
import progressiveDesktop from "@/assets/images/progressive-desktop.webp";

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
  staticSrcDesktop,
  staticSrcMobile,
}) => {
  return (
    <section
      className={`relative overflow-hidden ${
        isHomePage ? "flex flex-col gap-6 md:gap-10" : "h-auto"
      }`}
    >
      {isHomePage ? (
        <div className="w-full xl:h-[90vh] 2xl:h-[100vh] text-center">
          {/* <picture>
            <source media="(max-width:360px)" srcSet={banner360W?.src} />
            <source media="(max-width:375px)" srcSet={banner375W?.src} />
            <source media="(max-width:390px)" srcSet={banner390W?.src} />
            <source media="(max-width:414px)" srcSet={banner414W?.src} />
            <source media="(max-width:465px)" srcSet={banner465W?.src} />
            <source media="(max-width:480px)" srcSet={banner480W?.src} />
            <source media="(max-width:575px)" srcSet={banner575W?.src} />

            <source media="(max-width:1366px)" srcSet={banner1366W?.src} />
            <source media="(max-width:1920px)" srcSet={banner1920W?.src} />

            <CustomImg
              className="w-full h-auto object-cover"
              width="1920"
              height="1080"
              altAttr={altAttr || "Elegant diamond jewelry banner"}
              titleAttr={titleAttr}
              loading="eager"
              srcAttr={defaultBanner}
            />
          </picture> */}
          <video
            muted
            preload="none"
            aria-label="Homepage Banner Video"
            playsInline
            autoPlay
            loop
            className="w-full h-auto object-cover"
          >
            <source src={"/videos/home-page-video.mp4"} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : imageSrcDesktop || imageSrcMobile ? (
        <>
          {imageSrcMobile ? (
            <ProgressiveImg
              src={imageSrcMobile}
              title={titleAttr}
              alt={altAttr}
              placeholderSrc={progressiveMobile}
              className="object-cover  w-full lg:hidden"
              progressiveImgClassName="h-[738px] w-full"
            />
          ) : null}
          {imageSrcDesktop ? (
            <ProgressiveImg
              src={imageSrcDesktop}
              title={titleAttr}
              alt={altAttr}
              placeholderSrc={progressiveDesktop}
              className="object-cover  w-full hidden lg:block"
              progressiveImgClassName="h-[448px] w-full"
            />
          ) : null}
        </>
      ) : staticSrcMobile || staticSrcDesktop ? (
        <>
          {staticSrcDesktop ? (
            <CustomImg
              src={staticSrcDesktop}
              title={titleAttr}
              alt={altAttr}
              className="object-cover  w-full h-full hidden lg:block"
            />
          ) : null}
          {staticSrcMobile ? (
            <CustomImg
              src={staticSrcMobile}
              title={titleAttr}
              alt={altAttr}
              className="object-cover  w-full h-full lg:hidden"
            />
          ) : null}
        </>
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
              <div className="hidden md:flex mt-4 md:mt-4 flex-col md:flex-row items-center md:justify-center gap-2.5 md:gap-4">
                <PrimaryLinkButton
                  href="/customize/start-with-setting"
                  variant="transparentHover"
                >
                  SHOP ENGAGEMENT
                </PrimaryLinkButton>
                <PrimaryLinkButton
                  href="/collections/categories/Jewelry"
                  variant="transparentHover"
                >
                  SHOP ALL JEWELRY
                </PrimaryLinkButton>
              </div>
              <div className="md:hidden px-2 flex mt-4 md:mt-4 flex-wrap items-center justify-center gap-2.5 md:gap-4">
                <PrimaryLinkButton
                  href="/customize/start-with-setting"
                  variant="blackHover"
                >
                  SHOP ENGAGEMENT
                </PrimaryLinkButton>
                <PrimaryLinkButton
                  href="/collections/categories/Jewelry"
                  variant="blackHover"
                >
                  SHOP ALL JEWELRY
                </PrimaryLinkButton>
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
