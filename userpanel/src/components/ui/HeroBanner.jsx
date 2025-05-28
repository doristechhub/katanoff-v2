import { CustomImg } from "../dynamiComponents";
import { LinkButton } from "./button";

const HeroBanner = ({
  title,
  description,
  imageSrc,
  videoSrc,
  textAlignment = "left",
  banner400px,
  banner576px,
  banner768px,
  banner1024px,
  isHomePage = false,
  isStaticBanner = false,
  titleAttr = "",
  altAttr = "",
}) => {
  return (
    <section
      className={`relative overflow-hidden ${
        isHomePage ? "h-screen" : "mt-20 lg:mt-0 h-auto"
      }`}
    >
      {imageSrc ? (
        isHomePage ? (
          <>
            <div className="xs:hidden">
              <CustomImg
                src={banner400px}
                alt={altAttr}
                title={titleAttr}
                priority
                fill
                className="object-cover"
                sizes="w-full h-full"
              />
            </div>
            <div className="hidden xs:block md:hidden">
              <CustomImg
                src={banner576px}
                alt={altAttr}
                title={titleAttr}
                priority
                fill
                className="object-cover"
                sizes="w-full h-full"
              />
            </div>
            <div className="hidden md:block lg:hidden">
              <CustomImg
                src={banner768px}
                alt={altAttr}
                title={titleAttr}
                priority
                fill
                className="object-cover"
                sizes="w-full h-full"
              />
            </div>
            <div className="hidden lg:block 2xl:hidden">
              <CustomImg
                src={banner1024px}
                alt={altAttr}
                title={titleAttr}
                priority
                fill
                className="object-cover"
                sizes="w-full h-full"
              />
            </div>
            <div className="hidden 2xl:block">
              <CustomImg
                src={imageSrc}
                alt={altAttr}
                title={titleAttr}
                priority
                fill
                className="object-cover"
                sizes="w-full h-full"
              />
            </div>
          </>
        ) : (
          <CustomImg
            srcAttr={imageSrc}
            altAttr={altAttr}
            titleAttr={titleAttr}
            priority
            className={`w-full  ${
              isStaticBanner
                ? "object-cover h-[40vh] lg:h-auto"
                : isHomePage
                ? "object-cover h-full"
                : "h-[18vh] lg:h-auto lg:mt-6"
            }`}
          />
        )
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
          <div className=" absolute inset-0 flex justify-center lg:justify-normal items-center  w-full">
            <div className="md:w-[60%] lg:w-[45%] 2xl:w-[40%] text-white text-center">
              <h1 className="text-3xl md:text-4xl 2xl:text-4xl font-medium  leading-tight font-castoro">
                Diamonds that <br />
                Deserve You.
              </h1>
              <p className="mt-2 md:mt-2 text-sm ">
                Free 1ct Diamond Pendant with Purchase<sup>*</sup>
              </p>
              <div className="mt-4 md:mt-4 flex  items-center md:justify-center gap-2.5 md:gap-4">
                <LinkButton
                  href="/customize/start-with-setting"
                  className="lg:!h-0 w-fit lg:py-[16px] 2xl:py-[20px] 2xl:!min-w-[250px]   lg:!text-sm !font-bold rounded-none !border-white !border-1 !text-white !bg-transparent  hover:!bg-[#030817] hover:!text-white "
                >
                  SHOP ENGAGEMENT
                </LinkButton>
                <LinkButton
                  href="/collections/categories/Jewelry"
                  className="lg:!h-0 w-fit lg:py-[16px] 2xl:py-[20px] 2xl:!min-w-[250px]  lg:!text-sm !font-bold rounded-none !border-white !border-1 !text-white !bg-transparent  hover:!bg-[#030817] hover:!text-white "
                >
                  SHOP ALL JEWELRY
                </LinkButton>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 flex  items-center p-4 pl-12">
            <div
              className={`flex flex-col justify-center items-${textAlignment} w-full 
    max-w-[90%] sm:max-w-[70%] lg:max-w-[60%] text-${textAlignment}  md:gap-3`}
            >
              {title && description ? (
                <>
                  {description && (
                    <p className="text-base md:text-lg text-white">
                      {description}
                    </p>
                  )}
                  <h1 className="text-3xl md:text-5xl  2xl:text-6xl text-white font-castoro capitalize">
                    {title}
                  </h1>
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
