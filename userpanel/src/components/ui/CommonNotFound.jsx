import noDataImg from "@/assets/images/no-data.webp";
import { PrimaryLinkButton } from "../ui/button";
import { CustomImg } from "../dynamiComponents";

export default function CommonNotFound({
  message = "Sorry, No product Found",
  subMessage = "You can Try Our Different Product...",
  notFoundImg,
  showButton = true,
  href = "/",
  btnText = "Back To Shop",
  btnClassName = ""
}) {
  return (
    <section className="h-[60vh] lg:h-[70vh] gap-8 lg:gap-10 flex flex-col justify-center items-center text-center">
      <CustomImg
        srcAttr={notFoundImg || noDataImg}
        className="w-44 md:w-52 lg:w-64 2xl:w-auto"
        altAttr=""
        titleAttr=""
      />
      <div>
        {" "}
        <h3 className="text-2xl md:text-3xl 2xl:text-4xl font-castoro capitalize">
          {message}
        </h3>
        {subMessage ? (
          <p className="text-base mt-2 font-semibold">{subMessage}</p>
        ) : null}
        {showButton ? (
          <div className="flex justify-center mt-4">
            <PrimaryLinkButton href={href} className={`w-[70%] text-sm 2xl:text-xl ${btnClassName}`}>
              {btnText}
            </PrimaryLinkButton>
          </div>
        ) : null}
      </div>
    </section>
  );
}
