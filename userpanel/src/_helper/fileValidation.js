import { fileTypeWiseFileMimeType, fileTypeWiseFileSize } from "@/_utils/selectedTypeAndSize";

const isValidFileType = (fileType, files) => {
  const mimeType = fileTypeWiseFileMimeType(fileType);
  let counter = 0;
  for (const item of files) {
    if (mimeType.includes(item.type)) {
      counter += 1;
      if (counter === files.length) {
        return true;
      }
    } else {
      return false;
    }
  }
};

const isValidFileSize = (fileType, files) => {
  const acceptableSize = fileTypeWiseFileSize(fileType);
  let counter = 0;
  for (const item of files) {
    if (item.size < acceptableSize) {
      counter += 1;
      if (counter === files.length) {
        return true;
      }
    } else {
      return false;
    }
  }
};
export {
  isValidFileType,
  isValidFileSize,
};
