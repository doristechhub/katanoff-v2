/* eslint-disable no-loop-func */
import { uid } from "uid";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../firebase";

const uploadFile = (folder, files) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    if (folder && files.length) {
      let errFlag = false;
      let counter = 0;
      const urls = [];
      for (const item of files) {
        if (errFlag) {
          break;
        } else {
          const parts = item.name.split(".");
          const ext = parts[parts.length - 1];
          const filename = Date.now() + uid() + "." + ext;
          const path = `${folder}/${filename}`;

          // eslint-disable-next-line no-loop-func
          await uploadToFireStore(item, path)
            .then((data) => {
              urls.push(data);
              counter += 1;
              if (counter === files.length) {
                resolve(urls);
              }
            })
            .catch((e) => {
              errFlag = true;
              reject(e);
            });
        }
      }
    } else {
      reject(new Error("folder name and files required"));
    }
  });
};

const uploadToFireStore = (file, path) => {
  return new Promise((resolve, reject) => {
    const imageRef = ref(storage, path);
    uploadBytes(imageRef, file)
      .then((uploadResult) => {
        const url = getDownloadURL(ref(storage, uploadResult.ref.fullPath));
        resolve(url);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// ---------- delete file(s) ----------

const deleteFile = (folder, url) => {
  return new Promise((resolve, reject) => {
    if (url) {
      const parts = url.split("?")[0].split("/");
      const filename = parts[parts.length - 1];
      const imagePath = `${folder}/${filename.split("%2F").pop()}`;
      // Create a reference to the file to delete
      const deleteRef = ref(storage, imagePath);

      // Delete the file
      deleteObject(deleteRef)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.log(err.message);
          // reject(err)
        });
    } else {
      reject(new Error("folder name and url required"));
    }
  });
};

export { uploadFile, deleteFile };
