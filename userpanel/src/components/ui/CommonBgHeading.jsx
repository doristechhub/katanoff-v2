import Breadcrumb from "./Breadcrumb";

const CommonBgHeading = ({
  title,
  breadcrumb = false,
  rightText,
  showSelectAll = false,
  allSelected = false,
  titleClassName = '',
  onSelectAllChange = () => {},
}) => {
  return (
    <div className="relative w-full">
      <div className="px-4 container w-full relative flex justify-between items-center">
        {breadcrumb && <Breadcrumb currentPage={title} />}

        {/* Centered Title */}
        <h1
          className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   text-2xl xl:text-2xl font-medium font-castoro text-baseblack ${titleClassName}`}
        >
          {title}
        </h1>

        {showSelectAll && (
          <label className="absolute left-5 flex items-center gap-2 text-baseblack text-base lg:text-lg xs:flex cursor-pointer">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => onSelectAllChange(e.target.checked)}
              className="w-4 h-4 rounded-full border-2 border-gray-400 text-primary accent-primary focus:ring-primary checked:bg-primary checked:border-primary"
            />
            <span className="hidden xs:inline">Select All</span>
          </label>
        )}
        {/* Right Text */}
        {rightText && (
          <p className="text-baseblack font-castoro text-base lg:text-lg 2xl:text-xl hidden xs:block">
            {rightText}
          </p>
        )}
      </div>
    </div>
  );
};
export default CommonBgHeading;
