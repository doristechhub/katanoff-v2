import bookAppointmentDesktop from "@/assets/images/appointment/book-appointment-desktop.webp";
import bookAppointmentMobile from "@/assets/images/appointment/book-appointment-mobile.webp";
import { HeroBanner } from "@/components/dynamiComponents";
import AppointmentPage from "@/components/ui/AppointmentPage";

const AppointmentCustomJewelry = () => {
  return (
    <>
      <div className="relative w-full">
        <HeroBanner
          staticSrcMobile={bookAppointmentMobile}
          staticSrcDesktop={bookAppointmentDesktop}
          title=""
          description=""
          isStaticBanner={true}
          altAttr=""
          titleAttr=""
        />
      </div>
      <AppointmentPage />
    </>
  );
};

export default AppointmentCustomJewelry;
