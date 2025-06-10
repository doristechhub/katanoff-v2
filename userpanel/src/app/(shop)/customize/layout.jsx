import customizeRingBanner from "@/assets/images/customize/customize-ring-banner.webp";
import { CustomImg } from "@/components/dynamiComponents";
export default function MainLayout({ children }) {
  return (
    <>
      <div className="mt-11 md:mt-0 lg:mt-5">
        <CustomImg srcAttr={customizeRingBanner} />
      </div>
      {children}
    </>
  );
}
