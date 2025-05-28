"use client";

import { useState } from "react";
const CustomTabs = ({ childs, defaultActiveKey, className = "" }) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey);

  const handleTabSelect = (key) => {
    setActiveKey(key);
  };
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-center mb-6 font-Figtree">
        <div className="flex border-b border-#D9D9D9 px-0">
          {childs.map((tab) => (
            <button
              key={tab.eventKey}
              onClick={() => handleTabSelect(tab.eventKey)}
              className={`px-8 sm:px-4 md:px-4 xl:px-16 py-4 mt-10 md:mt-10 text-lg font-medium border-b-2 leading-5 ${activeKey === tab.eventKey
                ? "border-primary text-primary"
                : "border-transparent text-basegray hover:text-primary"
                }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>

      <div>
        {childs.map((tab) => (
          <div
            key={tab.eventKey}
            className={activeKey === tab.eventKey ? "block" : "hidden"}
          >
            {tab.child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomTabs;
