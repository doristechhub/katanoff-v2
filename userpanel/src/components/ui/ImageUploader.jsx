import { useState } from "react";
import { X } from "lucide-react";
import CustomImg from "./custom-img";

const imageReg = /image\/(png|jpg|jpeg|webp)/;

const getRegexByMediaType = () => {
  return imageReg;
};

export default function ImageUploader({
  files = [],
  previews = [],
  onChange = () => {},
  accept = "image/*",
  maxFiles = 5,
  maxTotalSize = 25 * 1024 * 1024,
  imgIcon,
  totalSizeMb = 25,
  setErrorMessage = () => {},
}) {
  const [isDragging, setIsDragging] = useState(false);

  const validateAndUpdate = (incomingFiles) => {
    setErrorMessage("");
    const imageRegex = getRegexByMediaType();
    for (const file of incomingFiles) {
      if (!file.type.match(imageRegex)) {
        setErrorMessage("Invalid File! Only PNG, JPG, JPEG, WEBP are allowed.");
        return;
      }
    }

    let combined = [...files, ...incomingFiles];

    if (combined.length > maxFiles) {
      setErrorMessage(`You can upload maximum ${maxFiles} files.`);
      return;
    }

    const totalSize = combined.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > maxTotalSize) {
      setErrorMessage(`Total upload size cannot exceed ${totalSizeMb}MB`);
      return;
    }

    const newPreviews = combined.map((file) =>
      file.type.startsWith("image/") ? URL.createObjectURL(file) : null
    );

    onChange(combined, newPreviews);
  };

  const handleFileSelect = (e) => {
    const incomingFiles = Array.from(e.target.files);
    validateAndUpdate(incomingFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndUpdate(droppedFiles);
  };
  const removeFile = (index) => {
    let newFiles = [...files];
    newFiles.splice(index, 1);

    let newPreviews = [...previews];
    newPreviews.splice(index, 1);
    const totalSize = newFiles.reduce((sum, f) => sum + (f?.size || 0), 0);

    if (totalSize <= maxTotalSize && newFiles.length <= maxFiles) {
      setErrorMessage("");
    }
    if (newFiles.length <= maxFiles) {
      setErrorMessage("");
    }
    onChange(newFiles, newPreviews);
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition
                    ${
                      isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept={accept}
          id="dynamic-file-upload"
          className="hidden"
          onChange={handleFileSelect}
        />

        <label htmlFor="dynamic-file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <CustomImg
              srcAttr={imgIcon}
              altAttr=""
              className="w-16 h-16 pb-2"
            />

            <p className="text-gray-600 font-medium">Drop or Select File</p>
            <p className="text-sm text-gray-500">
              Max Files: {maxFiles} | Max Size: {totalSizeMb} MB
            </p>
          </div>
        </label>
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="relative w-20 h-20 border rounded overflow-hidden"
            >
              <CustomImg
                src={previews[idx]}
                alt="uploaded"
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />

              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
