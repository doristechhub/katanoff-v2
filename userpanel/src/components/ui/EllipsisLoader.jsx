"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EllipsisLoader() {
  const [visibleDots, setVisibleDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleDots((prev) => (prev >= 3 ? 0 : prev + 1));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center text-primary font-semibold text-base">
      Please wait
      <div className="flex ml-0.5 gap-0.5 w-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <AnimatePresence key={i}>
            {i < visibleDots && (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 2 }}
                transition={{ duration: 0.2 }}
                className="inline-block"
              >
                .
              </motion.span>
            )}
          </AnimatePresence>
        ))}
      </div>
    </div>
  );
}
