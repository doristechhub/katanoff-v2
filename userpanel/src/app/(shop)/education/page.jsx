import React from "react";
import bannerDesktop from "@/assets/images/education/banner-desktop.webp";
import bannerMobile from "@/assets/images/education/banner-mobile.webp";
import img from "@/assets/images/education/Image.webp";
import DiamondInspirationSection from "@/components/ui/DiamondInspirationSection";
import LabGrownDiamondCare from "@/components/ui/LabGrownDiamondCare";
import FourCsSection from "@/components/ui/FourCsSection";
import ImageWithTitle from "@/components/ui/ImageWithTitle";
import CutSection from "@/components/ui/CutSection";
import ClaritySection from "@/components/ui/ClaritySection";
import DiamondColorChartSection from "@/components/ui/ColorSection";
import { HeroBanner } from "@/components/dynamiComponents";
import { PAGE_CONSTANTS } from "@/_helper";
import { PAGE_IMG_ALT_TITLE } from "@/_helper/pageImgAltTitle";

const EducationPage = () => {
  return (
    <>
      <HeroBanner
        staticSrcDesktop={bannerDesktop}
        staticSrcMobile={bannerMobile}
        isStaticBanner={true}
        altAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.EDUCATION].alt}
        titleAttr={PAGE_IMG_ALT_TITLE[PAGE_CONSTANTS.EDUCATION].title}
      />
      <DiamondInspirationSection />
      <LabGrownDiamondCare />
      <FourCsSection />
      <CutSection />
      <DiamondColorChartSection />
      <ClaritySection />
      <ImageWithTitle imageSrc={img.src} />
    </>
  );
};

export default EducationPage;
