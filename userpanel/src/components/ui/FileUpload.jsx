"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { SlClose } from "react-icons/sl";
import ErrorMessage from "./ErrorMessage";

const getImage = (value) =>
  typeof value === "string" ? value : URL.createObjectURL(value);

const FileUpload = ({ values, setFieldValue, setSelectedFile, selectedFile }) => {
  const inputRef = useRef();
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    setSelectedFile(values?.attachment);
    setFileError("");
  }, [values]);

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.match(/image\/(jpg|jpeg|png|gif|webp)/)) {
          setFileError("Only JPG, JPEG, WEBP, GIF, PNG files are allowed.");
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          setFileError("File size must be under 5MB.");
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setSelectedFile(reader.result);
          setFieldValue("attachment", file);
          setFileError("");
        };
      }
    },
    [setFieldValue, setSelectedFile]
  );

  const clearFile = useCallback(
    (e) => {
      e.stopPropagation();
      setSelectedFile(null);
      setFieldValue("attachment", null);
      setFileError("");
    },
    [setFieldValue, setSelectedFile]
  );

  return (
    <div className="w-full">
      <input
        className="hidden"
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={inputRef}
      />
      <button
        type="button"
        onClick={(e) => {
          inputRef.current?.click();
          e.stopPropagation();
        }}
        className="w-full d-flex justify-content-center align-items-center gap-1 bg-transparent"
      >
        {selectedFile ? (
          <div className="w-full">
            <div className="flex justify-end w-full">
              <span
                onClick={clearFile}
                className="cursor-pointer text-basegray hover:text-red-600 transition"
              >
                <SlClose size={20} />
              </span>
            </div>
            <div className="w-[200px] h-[200px] mx-auto mt-2 overflow-hidden border">
              <img
                src={getImage(selectedFile)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center items-center h-8">
            <p className="text-gray-66 flex items-center gap-2 mb-0">
              <HiPlus size={20} /> Choose Attachment
            </p>
          </div>

        )}
      </button>
      {fileError ? <ErrorMessage message={fileError} /> : null}
    </div>
  );
};

export default FileUpload;
