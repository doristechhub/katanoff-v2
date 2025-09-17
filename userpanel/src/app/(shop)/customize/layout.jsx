import desktopRingBanner from "@/assets/images/customize/desktop-ring-banner.webp";
import mobileRingBanner from "@/assets/images/customize/mobile-ring-banner.webp";
import CustomImg from "@/components/ui/custom-img";
export default function MainLayout({ children }) {
  return (
    <>
      <div>
        <CustomImg
          srcAttr={mobileRingBanner}
          className="block lg:hidden"
          altAttr={
            "lab grown diamond rings, custom engagement rings, wedding diamond rings, sustainable jewelry, fine jewelry New York, Katanoff"
          }
          titleAttr={
            "Katanoff | Shop Lab Grown Diamond Rings – Ethical Fine Jewelry"
          }
        />
        <CustomImg
          srcAttr={desktopRingBanner}
          className="hidden lg:block"
          altAttr={
            "lab grown diamond engagement ring, solitaire diamond ring, custom engagement jewelry, ethical fine jewelry, New York USA, Katanoff"
          }
          titleAttr={
            "Katanoff | Lab Grown Diamond Engagement Rings – New York Fine Jewelry"
          }
        />
      </div>
      {children}
    </>
  );
}
