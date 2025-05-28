import Link from "next/link";

const CommonBgHeading = ({
  title,
  backText,
  rightText,
  rightTextHref = "/",
  backHref = "/",
}) => {
  return (
    <div className="w-full bg-alabaster mt-[90px] lg:mt-4 py-6">
      <div className=" mx-auto px-4 flex items-center justify-center relative container">
        {backText && (
          <Link
            href={backHref}
            className="text-basegray text-base hover:underline absolute left-0 hidden xs:block"
          >
            &lt; {backText}
          </Link>
        )}

        <h1 className="text-2xl xl:text-3xl font-medium font-chong-modern text-baseblack">
          {title}
        </h1>

        {rightText && (
          <p className="text-baseblack font-chong-modern text-base lg:text-lg 2xl:text-xl  absolute right-0 xl:right-10 hidden xs:block">
            {" "}
            {rightText}
          </p>
        )}
      </div>
    </div>
  );
};
export default CommonBgHeading;
