"use client";
import { useEffect, useState } from "react";

const AccordionTabs = ({
  tabs = [],
  defaultOpenLabel = "",
  forceResetKey,
  labelCustomClass = "",
  contentCustomClass = "",
  alwaysOpenFirst = false,
  hideFirstToggleIcon = false,
}) => {
  const [activeTab, setActiveTab] = useState(defaultOpenLabel || "");

  useEffect(() => {
    setActiveTab(defaultOpenLabel || "");
  }, [defaultOpenLabel, forceResetKey]);

  return (
    <>
      {tabs.map(({ label, content }, index) => {
        const isFirst = index === 0;
        const isAlwaysOpen = alwaysOpenFirst && isFirst;
        const isOpen = isAlwaysOpen || activeTab === label;

        return (
          <div key={label} className="border-b border-grayborder">
            <button
              onClick={() => {
                if (!isAlwaysOpen) {
                  const isTryingToClose = isOpen;
                  if (alwaysOpenFirst) {
                    setActiveTab(isTryingToClose ? "" : label);
                    return;
                  }
                  if (isTryingToClose) return;
                  setActiveTab(label);
                }
              }}
              className="w-full text-left px-4 py-6 flex justify-between items-center"
            >
              <span
                className={`text-lg lg:text-xl 2xl:text-2xl font-medium font-castoro text-baseblack ${labelCustomClass}`}
              >
                {label}
              </span>

              {!((isFirst && hideFirstToggleIcon) || isAlwaysOpen) && (
                <span className="text-xl lg:text-2xl 4xl:text-3xl">
                  {isOpen ? "−" : "+"}
                </span>
              )}
            </button>

            {isOpen && (
              <div
                className={`px-4 pb-8 text-sm text-baseblack ${
                  label === "Product Detail" ? "lg:pb-16" : ""
                } ${contentCustomClass}`}
              >
                {content}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default AccordionTabs;
