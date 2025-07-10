import Breadcrumb from "./Breadcrumb";

const CommonBgHeading = ({
  title,
  breadcrumb = false,
  rightText,
  showSelectAll = false,
  allSelected = false,
  titleClassName = "",
  countMobileText = "",
  onSelectAllChange = () => {},
}) => {
  return (
    <div className="relative w-full">
      <div className="px-4 container w-full relative flex  gap-6">
        {breadcrumb && <Breadcrumb currentPage={title} />}
      </div>
      <div
        className={`px-4 container w-full relative flex flex-col gap-6 sm:flex-row pt-8 justify-center sm:items-center ${
          breadcrumb ? "sm:pt-4" : "sm:pt-0"
        }`}
      >
        <h1
          className={`justify-center flex mx-auto text-center
                   text-2xl xl:text-3xl font-medium font-castoro text-baseblack ${titleClassName}`}
        >
          {title}
        </h1>

        {showSelectAll && (
          <label className="sm:absolute sm:left-5 flex items-center gap-2 text-baseblack text-base lg:text-lg xs:flex cursor-pointer">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => onSelectAllChange(e.target.checked)}
              className="w-4 h-4 rounded-full border-2 border-gray-400 text-primary accent-primary focus:ring-primary checked:bg-primary checked:border-primary"
            />
            <span className="">Select All</span>
            {countMobileText && (
              <span className="inline sm:hidden text-medium">
                ({countMobileText})
              </span>
            )}
          </label>
        )}
        {/* Right Text */}
        {rightText && (
          <p className="sm:absolute sm:right-5 text-baseblack font-castoro text-base lg:text-lg 2xl:text-xl hidden xs:block">
            {rightText}
          </p>
        )}
      </div>
    </div>
  );
};
export default CommonBgHeading;
