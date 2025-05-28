import { fileSettings } from "@/_utils/fileSettings";
import DOMPurify from "dompurify";

export const sanitizeValue = (value) => {
  return DOMPurify.sanitize(value);
};

export const sanitizeObject = (obj) => {
  try {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        if (typeof value === "string") {
          return [key, sanitizeValue(value)];
        } else if (Array.isArray(value)) {
          return [
            key,
            value.map((item) => {
              if (typeof item === "string") {
                return sanitizeValue(item);
              } else if (
                typeof item === "object" &&
                item !== null &&
                !isSupportedFile(item)
              ) {
                return sanitizeObject(item);
              } else {
                // Return other types within the array as-is
                return item;
              }
            }),
          ];
        } else if (
          typeof value === "object" &&
          value !== null &&
          !isSupportedFile(value)
        ) {
          return [key, sanitizeObject(value)]; // Recursive call for nested objects
        } else {
          // Return other types (number,booleans etc.) as-is
          return [key, value];
        }
      })
    );
  } catch (error) {
    console.error("Error during sanitization:", error);
    return {};
  }
};

// Helper function to check for supported file types
const isSupportedFile = (value) => {
  return (
    value instanceof File &&
    fileSettings.OTHER_ALLOW_MIME_TYPE.some((type) =>
      value.type.startsWith(type)
    )
  );
};
