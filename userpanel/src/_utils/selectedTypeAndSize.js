import {fileSettings} from "./fileSettings";

const fileTypeWiseFileMimeType = (fileType) => {
  if (fileType === "IMAGE_FILE") {
    return fileSettings.IMAGE_ALLOW_MIME_TYPE;
  }else if (fileType === "VIDEO_FILE") {
    return fileSettings.VIDEO_ALLOW_MIME_TYPE;
  } 
   else {
    return [
      ...fileSettings.OTHER_ALLOW_MIME_TYPE,
    ];
  }
};

const fileTypeWiseFileSize = (fileType) => {
  if (fileType === "IMAGE_FILE") {
    return fileSettings.IMAGE_ALLOW_FILE_SIZE; // byte format is used for this size.
  } else if (fileType === "VIDEO_FILE") {
    return fileSettings.VIDEO_ALLOW_FILE_SIZE; // byte format is used for this size.
  } else {
    return fileSettings.OTHER_ALLOW_FILE_SIZE; // byte format is used for this size.
  }
};

export { fileTypeWiseFileMimeType, fileTypeWiseFileSize };
