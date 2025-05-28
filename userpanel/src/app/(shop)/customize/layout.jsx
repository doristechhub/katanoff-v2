import startWithSetting from "@/assets/images/collections/start-with-setting.webp";
import HeroBanner from "@/components/ui/HeroBanner";

export default function MainLayout({ children }) {
  return (
    <>
      <HeroBanner titleAttr={""} altAttr={""} imageSrc={startWithSetting} />
      {children}
    </>
  );
}
