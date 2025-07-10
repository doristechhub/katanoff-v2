import React, { useEffect } from "react";

const Modal = ({
  children,
  title,
  footer,
  className = "",
  titleClassName = "",
}) => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className={`mx-5 md:mx-0 bg-offwhite  relative shadow-xl w-full max-w-4xl md:max-w-2xl lg:max-w-4xl p-0 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top: Title & Close */}
        <div className="flex justify-between items-center px-8 pt-6 pb-4 bg-white">
          <h2
            className={`font-castoro text-xl md:text-2xl xl:text-2xl text-baseblack ${titleClassName}`}
          >
            {title}
          </h2>
        </div>

        {/* Middle: Content */}
        <div className="px-8 py-4">{children}</div>

        {/* Bottom: Footer */}
        {footer && <div className="px-8 pb-6 pt-2 ">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
