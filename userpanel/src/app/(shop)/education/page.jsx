import React from "react";
import HeroBanner from "@/components/ui/HeroBanner";
import banner from "@/assets/images/education/banner.webp";
import img from "@/assets/images/education/Image.webp";
import DiamondInspirationSection from "@/components/ui/DiamondInspirationSection";
import LabGrownDiamondCare from "@/components/ui/LabGrownDiamondCare";
import FourCsSection from "@/components/ui/FourCsSection";
import ImageWithTitle from "@/components/ui/ImageWithTitle";
import CutSection from "@/components/ui/CutSection";
import ClaritySection from "@/components/ui/ClaritySection";
import DiamondColorChartSection from "@/components/ui/ColorSection";

const EducationPage = () => {
  return (
    <>
      <HeroBanner
        imageSrc={banner}
        title={"Diamond Education"}
        description={"Celebrating Every Shade of You"}
        isStaticBanner={true}
        altAttr=""
        titleAttr=""
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
