"use client";
import notFound from "@/assets/images/404-not-found.webp";
import { PrimaryLinkButton } from "@/components/ui/button";
import { CustomImg } from "@/components/dynamiComponents";

const NotFoundPage = () => {
  return (
    <section className={"flex flex-col justify-center  items-center h-full"}>
      <div className="overflow-hidden max-w-[400px] h-[200px] md:max-w-[500px] md:h-[250px] 2xl:max-w-[600px] 2xl:h-[400px]">
        <CustomImg
          srcAttr={notFound}
          className="h-full w-full object-contain"
        />
      </div>
      <h3 className="text-3xl md:text-4xl mt-9 font-castoro">Page Not Found</h3>
      <p className="mt-5 text-center text-md md:text-xl font-medium px-4 md:px-8 w-full lg:w-[60%] 2xl:w-[40%]">
        We're sorry, but the page you're looking for cannot be found. Please use
        the button below to return to the homepage.
      </p>
      <PrimaryLinkButton
        className="uppercase mt-8 lg:mt-12"
        href={"/"}
        title="Back To Home"
      >
        BACK TO HOME
      </PrimaryLinkButton>
    </section>
  );
};

export default NotFoundPage;
