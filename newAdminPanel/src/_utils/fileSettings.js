const fileSettings = {
  PRODUCT_IMAGE_FILE_LIMIT: 8,
  PRODUCT_THUMBNAIL_IMAGE_FILE_LIMIT: 1,
  PRODUCT_VIDEO_FILE_LIMIT: 1,
  CUSTOMIZATION_SUB_TYPE_IMAGE_FILE_LIMIT: 1,
  SETTING_STYLE_IMAGE_FILE_LIMIT: 1,
  DIAMOND_SHAPE_IMAGE_FILE_LIMIT: 1,
  RETURN_IMAGE_FILE_LIMIT: 1,
  BANNER_IMAGE_FILE_LIMIT: 1,
  RETURN_REQUEST_IMAGE_FILE_LIMIT: 5,
  RETURN_REQUEST_TOTAL_IMAGE_FILE_SIZE: 26214400,

  IMAGE_FILE_NAME: 'IMAGE_FILE',
  THUMBNAIL_IMAGE_FILE_NAME: 'THUMBNAIL_IMAGE_FILE',
  //   IMAGE_ALLOW_FILE_SIZE: 5242880, // 5 MB
  // MAX_FILE_SIZE_MB: 5, // 5 MB
  IMAGE_ALLOW_FILE_SIZE: 2097152, // 2 MB
  MAX_FILE_SIZE_MB: 2, // 2 MB
  IMAGE_ALLOW_MIME_TYPE: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],

  VIDEO_FILE_NAME: 'VIDEO_FILE',
  VIDEO_ALLOW_FILE_SIZE: 10485760, // 10 MB
  // VIDEO_ALLOW_FILE_SIZE: 104857600, // 100 MB
  VIDEO_ALLOW_MIME_TYPE: ['video/mp4', 'video/webm', 'video/ogg'],

  OTHER_ALLOW_FILE_SIZE: 5242880, // 5 MB
  OTHER_ALLOW_MIME_TYPE: [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/ogg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    'application/vnd.ms-word.document.macroEnabled.12',
    'application/vnd.ms-word.template.macroEnabled.12',
  ],
};

export default fileSettings;
