import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeInfo,
  CircleAlert,
  CircleCheck,
  TriangleAlert,
} from "lucide-react";
import { SlClose } from "react-icons/sl";

const severityStyles = {
  success: "bg-[#28a785]",
  error: "bg-[#D93838]",
  warning: "bg-[#ffc107]",
  info: "bg-[#17a2b8] ",
};

const iconMap = {
  success: <CircleCheck className="w-6 h-6" />,
  error: <CircleAlert className="w-6 h-6" />,
  warning: <TriangleAlert className="w-6 h-6" />,
  info: <BadgeInfo className="w-6 h-6" />,
};

const FixedAlert = ({ type = "info", message, removeMessage, className }) => {
  if (!message) return null;
  type = type?.toLowerCase();
  return (
    <AnimatePresence>
      <motion.div
        className="w-full"
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        initial={{
          opacity: 0,
          scale: 0.8,
          position: "fixed",
          top: "0",
          right: "0",
          zIndex: "9999",
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
      >
        <div
          className={`w-full  mx-auto flex items-center justify-center p-2.5 md:p-4 text-white ${className} ${severityStyles[type]}`}
        >
          <div className="mr-3 text-white">{iconMap[type]}</div>
          <p className="text-sm md:text-base">{message}</p>
          {removeMessage ? (
            <div
              className="p-1.5 xxs:p-2 hover:bg-white/10 text-white transition-colors"
              onClick={removeMessage}
            >
              <SlClose color="#fffff" className="w-5 h-5 xxs:w-6 xxs:h-6" />
            </div>
          ) : (
            ""
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FixedAlert;
