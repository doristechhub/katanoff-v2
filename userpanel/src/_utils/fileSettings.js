const fileSettings = {
  CUSTOM_JEWELRY_FILE_LIMIT: 1,

  IMAGE_FILE_NAME: "IMAGE_FILE",
  IMAGE_ALLOW_FILE_SIZE : 5242880, // 5 MB
  IMAGE_ALLOW_MIME_TYPE: [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp"
  ],

  VIDEO_FILE_NAME: "VIDEO_FILE",
  VIDEO_ALLOW_FILE_SIZE : 10485760, // 10 MB
  VIDEO_ALLOW_MIME_TYPE: [
    "video/mp4",
    "video/webm",
    "video/ogg"
  ],

  OTHER_ALLOW_FILE_SIZE : 5242880, // 5 MB
  OTHER_ALLOW_MIME_TYPE: [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/ogg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
    "application/vnd.ms-word.document.macroEnabled.12",
    "application/vnd.ms-word.template.macroEnabled.12",
  ],
};

export {fileSettings};
