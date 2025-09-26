import { SLIDER_GRID, THREE_GRID, THUMBNAIL, TWO_GRID } from "src/_helpers/constants";
import fileSettings from "./fileSettings";

const fileTypeWiseFileMimeType = (fileType) => {
  if (fileType === "IMAGE_FILE") {
    return fileSettings.IMAGE_ALLOW_MIME_TYPE;
  } else if (fileType === "VIDEO_FILE") {
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
  } else if (fileType === "THUMBNAIL_IMAGE_FILE") {
    return fileSettings.IMAGE_ALLOW_FILE_SIZE;
  } else if (fileType === "VIDEO_FILE") {
    return fileSettings.VIDEO_ALLOW_FILE_SIZE; // byte format is used for this size.
  } else {
    return fileSettings.OTHER_ALLOW_FILE_SIZE; // byte format is used for this size.
  }
};

const getReadableType = (type) => {
  switch (type) {
    case "slider_grid":
      return SLIDER_GRID;
    case "two_grid":
      return TWO_GRID;
    case "three_grid":
      return THREE_GRID;
    case "default":
      return THUMBNAIL;
    default:
      return THUMBNAIL;
  }
};


export { fileTypeWiseFileMimeType, fileTypeWiseFileSize, getReadableType };
