import noDataImg from "@/assets/images/no-data.webp";
import { PrimaryLinkButton } from "../ui/button";
import { CustomImg } from "../dynamiComponents";

export default function ProductNotFound({
  message = "Sorry, No product Found",
  subMessage = "You can Try Our Different Product...",
}) {
  return (
    <section className="h-[60vh] lg:h-[70vh] gap-8 lg:gap-10 flex flex-col justify-center items-center text-center">
      <CustomImg
        srcAttr={noDataImg}
        className="w-44 md:w-52 lg:w-56 2xl:w-auto"
        altAttr=""
        titleAttr=""
      />
      <div>
        {" "}
        <h3 className="text-2xl md:text-3xl 2xl:text-4xl font-castoro">
          {message}
        </h3>
        <p className="text-base mt-2 font-semibold">{subMessage}</p>
        <div className="flex justify-center mt-4">
          <PrimaryLinkButton href="/" className="w-[70%] text-sm 2xl:text-xl">
            BACK TO SHOP
          </PrimaryLinkButton>
        </div>
      </div>
    </section>
  );
}
