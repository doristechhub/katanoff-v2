"use client";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function TableOfContents({ sections }) {
  const [open, setOpen] = useState(true);
  const [activeId, setActiveId] = useState(null);

  const handleScroll = (e, id) => {
    e.preventDefault();
    setActiveId(id);

    const target = document.getElementById(id);
    if (target) {
      const yOffset = -100;
      const y = target.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="border rounded-md mx-auto">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex justify-between items-center px-4 py-3 ${
          open ? "border-b" : ""
        } font-semibold text-gray-900`}
      >
        <span>In This Blog</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-800" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-800" />
        )}
      </button>

      {open && (
        <div className="px-6 py-4 space-y-3">
          <ul className="list-disc list-inside  marker:text-primary">
            {sections.map((section, idx) => (
              <li key={idx}>
                <Link
                  href="/"
                  onClick={(e) => handleScroll(e, section.id)}
                  className={`text-sm cursor-pointer hover:underline underline-offset-4 transition-colors duration-200 
                    ${
                      activeId === section.id
                        ? "text-gray-66 font-semibold"
                        : "text-primary"
                    }`}
                >
                  {section.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
