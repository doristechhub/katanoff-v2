import { uid } from "uid";
import { customJewelryUrl, deleteFile, fetchWrapperService, isValidFileSize, isValidFileType, sanitizeObject, uploadFile } from "@/_helper";
import { fileSettings } from "@/_utils/fileSettings";

const addNewCustomJewelryRequest = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { name, email, mobile, imageFile, description } =
        sanitizeObject(params);
      name = name ? name?.trim() : null;
      email = email ? email?.trim() : null;
      mobile = mobile ? Number(mobile) : null;
      imageFile = typeof imageFile === "object" ? [imageFile] : [];
      description = description ? description?.trim() : null;
      if (name && email && mobile && description) {
        if (!imageFile.length) {
          reject(new Error("It's necessary to have a image."));
          return;
        } else if (imageFile.length > fileSettings.CUSTOM_JEWELRY_FILE_LIMIT) {
          reject(
            new Error(
              `You can only ${fileSettings.CUSTOM_JEWELRY_FILE_LIMIT} image upload here`
            )
          );
          return;
        } else {
          const validAdFileType = isValidFileType(
            fileSettings.IMAGE_FILE_NAME,
            imageFile
          );

          if (!validAdFileType) {
            reject(
              new Error(
                "Invalid file! (Only JPG, JPEG, PNG, WEBP files are allowed!)"
              )
            );
            return;
          }

          const validAdFileSize = isValidFileSize(
            fileSettings.IMAGE_FILE_NAME,
            imageFile
          );
          if (!validAdFileSize) {
            reject(new Error("Invalid File Size! (Only 5 MB are allowed!)"));
            return;
          }

          const filesPayload = [...imageFile];
          const uploadedFileUrls = await uploadFile(
            customJewelryUrl,
            filesPayload
          );
          if (uploadedFileUrls?.length) {
            const uuid = uid();
            let insertPattern = {
              name,
              email,
              mobile,
              image: uploadedFileUrls[0],
              description,
              id: uuid,
              createdDate: Date.now(),
              updatedDate: Date.now(),
            };
            const createPattern = {
              url: `${customJewelryUrl}/${uuid}`,
              insertPattern,
            };
            fetchWrapperService
              .create(createPattern)
              .then((response) => {
                resolve(createPattern);
              })
              .catch((e) => {
                reject(
                  new Error(
                    "An error occurred during creating a new custom jewelry request."
                  )
                );
                // whenever an error occurs for creating a custom jewelry request the file is deleted
                if (uploadedFileUrls && uploadedFileUrls.length) {
                  uploadedFileUrls.map((url) =>
                    deleteFile(customJewelryUrl, url)
                  );
                }
              });
          } else {
            reject(new Error("Uploaded File Urls not found"));
          }
        }
      } else {
        reject(new Error("Invalid Data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const customJewelryService = {
  addNewCustomJewelryRequest,
};
