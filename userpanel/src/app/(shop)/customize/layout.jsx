import desktopRingBanner from "@/assets/images/customize/desktop-ring-banner.webp";
import mobileRingBanner from "@/assets/images/customize/mobile-ring-banner.webp";
import { CustomImg } from "@/components/dynamiComponents";
export default function MainLayout({ children }) {
  return (
    <>
      <div>
        <CustomImg srcAttr={mobileRingBanner} className="block lg:hidden" />
        <CustomImg srcAttr={desktopRingBanner} className="hidden lg:block" />
      </div>
      {children}
    </>
  );
}
