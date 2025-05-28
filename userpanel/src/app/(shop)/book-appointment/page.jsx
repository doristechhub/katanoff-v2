import HeroBanner from "@/components/ui/HeroBanner";
import contactus from "@/assets/images/contact-us/contact.webp";
import KeyFeatures from "@/components/ui/KeyFeatures";
import AppointmentPage from "@/components/ui/AppointmentPage";

const AppointmentCustomJewelry = () => {

  return (
    <>
      <div className="relative w-full">
        <HeroBanner
          imageSrc={contactus}
          title=""
          description=""
          isStaticBanner={true}
          altAttr=""
          titleAttr=""
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-2xl md:text-4xl 2xl:text-5xl text-white font-castoro capitalize">Online Appointment</h1>
          <p className="mt-2 text-base md:text-lg font-Figtree">
            We're here to help – reach out anytime!
          </p>
          <div className="mt-4 w-8 h-[1px] bg-white" />
        </div>
      </div>
      <AppointmentPage />

    </>
  );
};

export default AppointmentCustomJewelry;
