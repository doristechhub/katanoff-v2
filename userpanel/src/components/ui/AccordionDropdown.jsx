"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function AccordionDropdown({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full  md:px-0 mx-auto text-gray-900">
      {items.map((item, index) => (
        <div key={index} className="border-t border-black">
          <button
            className="w-full flex justify-between items-center py-8 px-6 text-left transition-all duration-200"
            onClick={() => toggleDropdown(index)}
          >
            <span className="text-base md:text-xl xl:text-2xl font-castoro font-medium">
              {item?.title}
            </span>
            {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? "max-h-40 py-2 px-6" : "max-h-0"
            }`}
          >
            <p className="text-base md:text-base">{item?.content}</p>
          </div>
        </div>
      ))}
      <div className="border-t border-black"></div>
    </div>
  );
}
