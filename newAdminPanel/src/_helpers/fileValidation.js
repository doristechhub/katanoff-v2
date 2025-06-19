import { fileTypeWiseFileMimeType, fileTypeWiseFileSize } from '../_utils/selectedTypeAndSize';

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

const validateImageResolution = async (file, expectedWidth, expectedHeight) => {
  try {
    // Ensure the input is a valid File object
    if (!(file instanceof File)) {
      console.error('Invalid input: Expected a File object');
      return false;
    }

    // Create a URL for the file to load it as an image
    const imageUrl = URL.createObjectURL(file);

    // Create a new Image object
    const img = new Image();

    // Return a promise to handle the image loading
    return new Promise((resolve) => {
      img.onload = () => {
        // Check if the image dimensions match the expected values
        const isValid = img.naturalWidth === expectedWidth && img.naturalHeight === expectedHeight;

        // Clean up the object URL
        URL.revokeObjectURL(imageUrl);

        resolve(isValid);
      };

      img.onerror = () => {
        console.error('Error loading image: File may be corrupted or not an image');
        // Clean up the object URL on error
        URL.revokeObjectURL(imageUrl);
        resolve(false);
      };

      // Set the image source to trigger loading
      img.src = imageUrl;
    });
  } catch (e) {
    console.error('Error validating image resolution:', e);
    return false;
  }
};

export { isValidFileType, isValidFileSize, validateImageResolution };
