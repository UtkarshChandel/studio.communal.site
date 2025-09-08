"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import Button from "./Button";
import CloseIcon from "./icons/CloseIcon";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload?: (files: File[]) => void;
  className?: string;
}

// Component for previewing text files
const TextFilePreview = React.memo(({ file }: { file: File }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContent(text || "");
      setLoading(false);
    };

    reader.onerror = () => {
      setContent("Error reading file");
      setLoading(false);
    };

    reader.readAsText(file);
  }, [file]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[#535862] text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <pre className="font-mono text-sm text-[#181d27] whitespace-pre-wrap break-words">
      {content}
    </pre>
  );
});

TextFilePreview.displayName = "TextFilePreview";

type ModalState = "empty" | "uploading" | "uploaded" | "describing";

interface UploadedFile {
  id: string;
  file: File;
  description?: string;
  tags: string[];
}

// Upload cloud icon component matching the Figma design
const UploadCloudIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.6665 13.3333L9.99984 10M9.99984 10L13.3332 13.3333M9.99984 10V17.5M16.6665 13.9524C17.6844 13.1117 18.3332 11.8399 18.3332 10.4167C18.3332 7.88536 16.2811 5.83333 13.7498 5.83333C13.5677 5.83333 13.3974 5.73833 13.3049 5.58145C12.2182 3.73736 10.2119 2.5 7.9165 2.5C4.46472 2.5 1.6665 5.29822 1.6665 8.75C1.6665 10.4718 2.36271 12.0309 3.48896 13.1613"
      stroke="#535862"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// File icon component matching the Figma design
const FileIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.33317 1.51265V4.26634C9.33317 4.63971 9.33317 4.82639 9.40583 4.969C9.46975 5.09444 9.57173 5.19643 9.69718 5.26035C9.83978 5.33301 10.0265 5.33301 10.3998 5.33301H13.1535M13.3332 6.65849V11.4663C13.3332 12.5864 13.3332 13.1465 13.1152 13.5743C12.9234 13.9506 12.6175 14.2566 12.2412 14.4484C11.8133 14.6663 11.2533 14.6663 10.1332 14.6663H5.8665C4.7464 14.6663 4.18635 14.6663 3.75852 14.4484C3.3822 14.2566 3.07624 13.9506 2.88449 13.5743C2.6665 13.1465 2.6665 12.5864 2.6665 11.4663V4.53301C2.6665 3.4129 2.6665 2.85285 2.88449 2.42503C3.07624 2.0487 3.3822 1.74274 3.75852 1.55099C4.18635 1.33301 4.7464 1.33301 5.8665 1.33301H8.00769C8.49687 1.33301 8.74146 1.33301 8.97163 1.38827C9.17571 1.43726 9.3708 1.51807 9.54974 1.62773C9.75157 1.75141 9.92453 1.92436 10.2704 2.27027L12.3959 4.39575C12.7418 4.74165 12.9148 4.9146 13.0385 5.11644C13.1481 5.29538 13.2289 5.49047 13.2779 5.69454C13.3332 5.92472 13.3332 6.16931 13.3332 6.65849Z"
      stroke="#7F56D9"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Check icon component for completed uploads
const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" fill="#5350EC" />
    <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" stroke="#7F56D9" />
    <path
      d="M11.3337 5.5L6.75033 10.0833L4.66699 8"
      stroke="white"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Trash/Delete icon component for removing uploads
const TrashIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="18"
    height="20"
    viewBox="0 0 18 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.3333 5.00033V4.33366C12.3333 3.40024 12.3333 2.93353 12.1517 2.57701C11.9919 2.2634 11.7369 2.00844 11.4233 1.84865C11.0668 1.66699 10.6001 1.66699 9.66667 1.66699H8.33333C7.39991 1.66699 6.9332 1.66699 6.57668 1.84865C6.26308 2.00844 6.00811 2.2634 5.84832 2.57701C5.66667 2.93353 5.66667 3.40024 5.66667 4.33366V5.00033M7.33333 9.58366V13.7503M10.6667 9.58366V13.7503M1.5 5.00033H16.5M14.8333 5.00033V14.3337C14.8333 15.7338 14.8333 16.4339 14.5608 16.9686C14.3212 17.439 13.9387 17.8215 13.4683 18.0612C12.9335 18.3337 12.2335 18.3337 10.8333 18.3337H7.16667C5.76654 18.3337 5.06647 18.3337 4.53169 18.0612C4.06129 17.8215 3.67883 17.439 3.43915 16.9686C3.16667 16.4339 3.16667 15.7338 3.16667 14.3337V5.00033"
      stroke="#717680"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function FileUploadModal({
  isOpen,
  onClose,
  onFileUpload,
  className = "",
}: FileUploadModalProps) {
  const [modalState, setModalState] = useState<ModalState>("empty");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFileIds, setUploadingFileIds] = useState<string[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [tempDescription, setTempDescription] = useState("");
  const [tempTags, setTempTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoize the current file to prevent unnecessary re-renders
  const currentFile = useMemo(() => {
    return uploadedFiles[currentFileIndex]?.file || null;
  }, [uploadedFiles, currentFileIndex]);

  // Memoize the preview URL to prevent re-creation on every render
  const currentPreviewUrl = useMemo(() => {
    if (modalState === "describing" && currentFile) {
      return URL.createObjectURL(currentFile);
    }
    return null;
  }, [modalState, currentFile]);

  // Cleanup preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (currentPreviewUrl) {
        URL.revokeObjectURL(currentPreviewUrl);
      }
    };
  }, [currentPreviewUrl]);

  // Function to truncate file names
  const truncateFileName = (
    fileName: string,
    maxLength: number = 35
  ): string => {
    if (fileName.length <= maxLength) {
      return fileName;
    }

    // Find the last dot to preserve file extension
    const lastDotIndex = fileName.lastIndexOf(".");

    if (lastDotIndex === -1) {
      // No extension found, just truncate
      return fileName.substring(0, maxLength - 3) + "...";
    }

    const extension = fileName.substring(lastDotIndex);
    const baseName = fileName.substring(0, lastDotIndex);
    const maxBaseLength = maxLength - extension.length - 3; // 3 for "..."

    if (maxBaseLength <= 0) {
      // Extension is too long, just show truncated filename
      return fileName.substring(0, maxLength - 3) + "...";
    }

    return baseName.substring(0, maxBaseLength) + "..." + extension;
  };

  // File validation - only PDF and TXT
  const validateFile = (file: File): boolean => {
    const allowedTypes = ["application/pdf", "text/plain"];
    const allowedExtensions = [".pdf", ".txt"];

    const hasValidType = allowedTypes.includes(file.type);
    const hasValidExtension = allowedExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );

    return hasValidType || hasValidExtension;
  };

  const handleFileSelect = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(validateFile);

      if (validFiles.length === 0) {
        alert("Please select only PDF or TXT files.");
        return;
      }

      if (validFiles.length !== fileArray.length) {
        alert("Some files were skipped. Only PDF and TXT files are allowed.");
      }

      // Create uploaded files immediately and start upload process
      const newUploadedFiles: UploadedFile[] = validFiles.map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        description: "",
        tags: [],
      }));

      const newFileIds = newUploadedFiles.map((f) => f.id);

      // Add new files to the TOP of the existing list
      setUploadedFiles((prev) => [...newUploadedFiles, ...prev]);
      setUploadingFileIds(newFileIds);
      setModalState("uploading");
      setUploadProgress(0);

      // Simulate progress for the new files
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadingFileIds([]);
            setModalState("uploaded");
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      onFileUpload?.(validFiles);
    },
    [onFileUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (e.dataTransfer.files) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadMore = () => {
    // Don't reset existing files, just trigger file input
    fileInputRef.current?.click();
  };

  const handleNext = () => {
    if (modalState === "uploaded") {
      // Start describing files
      setCurrentFileIndex(0);
      setTempDescription(uploadedFiles[0]?.description || "");
      setTempTags(uploadedFiles[0]?.tags || []);
      setModalState("describing");
    } else if (modalState === "describing") {
      // Save current file's description and tags
      const updatedFiles = [...uploadedFiles];
      updatedFiles[currentFileIndex] = {
        ...updatedFiles[currentFileIndex],
        description: tempDescription,
        tags: tempTags,
      };
      setUploadedFiles(updatedFiles);

      // Move to next file or complete
      if (currentFileIndex < uploadedFiles.length - 1) {
        const nextIndex = currentFileIndex + 1;
        setCurrentFileIndex(nextIndex);
        setTempDescription(updatedFiles[nextIndex]?.description || "");
        setTempTags(updatedFiles[nextIndex]?.tags || []);
      } else {
        // All files described, submit
        console.log("All files completed with descriptions:", updatedFiles);
        onClose();
      }
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tempTags.includes(newTag.trim())) {
      setTempTags([...tempTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTempTags(tempTags.filter((tag) => tag !== tagToRemove));
  };

  const handlePreview = () => {
    if (currentFile) {
      // Create a URL for the file to preview
      const fileUrl = URL.createObjectURL(currentFile);
      window.open(fileUrl, "_blank");
      // Clean up the URL after a delay to prevent memory leaks
      setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
    }
  };

  // Function to get preview URL for a file
  const getPreviewUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };

  // Function to check if we can show inline preview
  const canShowInlinePreview = (file: File): boolean => {
    return (
      file.type === "application/pdf" ||
      file.type === "text/plain" ||
      file.name.toLowerCase().endsWith(".txt")
    );
  };

  const handleClose = () => {
    // Reset all state when closing
    setModalState("empty");
    setUploadedFiles([]);
    setUploadProgress(0);
    setUploadingFileIds([]);
    setCurrentFileIndex(0);
    setTempDescription("");
    setTempTags([]);
    setNewTag("");
    setIsDragOver(false);
    onClose();
  };

  const handleCancel = () => {
    if (modalState === "describing") {
      // Go back to uploaded state
      setModalState("uploaded");
      setTempDescription("");
      setTempTags([]);
      setNewTag("");
    } else {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-[20px] shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.1),0px_8px_8px_-4px_rgba(10,13,18,0.04)] w-full max-w-md lg:max-w-lg xl:max-w-xl max-h-[90vh] font-inter ${className} flex flex-col`}
      >
        {/* Header */}
        <div className="relative bg-white rounded-t-[20px] px-6 pt-6 flex-shrink-0">
          <div className="flex flex-col gap-1 mb-5">
            <h2 className="font-inter font-semibold text-[18px] leading-[28px] text-[#181d27]">
              Upload and attach files
            </h2>
            <p className="font-inter font-normal text-[14px] leading-[20px] text-[#535862]">
              Upload and attach files to this project.
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-[10px] rounded-lg hover:bg-gray-100 transition-colors"
          >
            <CloseIcon className="w-6 h-6 text-[#71767f]" />
          </button>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0 scrollable-content">
          {modalState === "describing" ? (
            <div className="flex flex-col gap-5">
              {/* File Header */}
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-12 h-12 relative">
                  <div className="absolute bg-[#f4ebff] left-[-2px] top-[-2px] w-14 h-14 rounded-[28px] flex items-center justify-center">
                    <div className="absolute border-4 border-[#f9f5ff] border-solid inset-[-2px] pointer-events-none rounded-[30px]" />
                    <FileIcon className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-inter font-semibold text-[16px] leading-[24px] text-[#181d27]">
                    File {currentFileIndex + 1}:{" "}
                    {truncateFileName(currentFile?.name || "", 45)}
                  </h3>
                  <p className="font-inter font-normal text-[14px] leading-[20px] text-[#535862]">
                    Add Tags and Description of the file
                  </p>
                </div>
              </div>

              {/* Preview Area */}
              <div className="bg-[#f9f9f9] border border-[#e9eaeb] rounded-xl overflow-hidden">
                {currentFile && canShowInlinePreview(currentFile) ? (
                  <div className="relative">
                    {/* Preview Header with External Preview Button */}
                    <div className="flex items-center justify-between p-3 bg-white border-b border-[#e9eaeb]">
                      <span className="font-inter text-[14px] text-[#535862]">
                        Document Preview
                      </span>
                      <Button
                        variant="outline"
                        onClick={handlePreview}
                        size="sm"
                        className="text-xs"
                      >
                        Open in New Tab
                      </Button>
                    </div>

                    {/* Preview Content */}
                    <div className="min-h-[250px] max-h-[300px] overflow-hidden">
                      {currentFile?.type === "application/pdf" ? (
                        // PDF Preview
                        <iframe
                          src={currentPreviewUrl || ""}
                          className="w-full h-[300px] border-0"
                          title={`Preview of ${currentFile.name}`}
                        />
                      ) : (
                        // Text File Preview
                        <div className="p-4 h-[250px] overflow-y-auto bg-white">
                          {currentFile && (
                            <TextFilePreview file={currentFile} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // Fallback for non-previewable files
                  <div className="p-4 min-h-[120px] flex items-center justify-center">
                    <Button
                      variant="outline"
                      onClick={handlePreview}
                      className="min-w-[100px]"
                    >
                      Preview
                    </Button>
                  </div>
                )}
              </div>

              {/* Description Field */}
              <div className="flex flex-col gap-2">
                <label className="font-inter font-medium text-[14px] leading-[20px] text-[#181d27]">
                  Description*
                </label>
                <textarea
                  value={tempDescription}
                  onChange={(e) => setTempDescription(e.target.value)}
                  placeholder="Write a brief description to show on your profile..."
                  className="w-full min-h-[120px] p-3 border border-[#e9eaeb] rounded-lg resize-none 
                           font-inter text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#535862]
                           focus:outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]"
                  rows={5}
                />
              </div>

              {/* Tags Field */}
              <div className="flex flex-col gap-2">
                <label className="font-inter font-medium text-[14px] leading-[20px] text-[#181d27]">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tempTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#4361ee]/10 text-[#4361ee] 
                               rounded-full font-inter text-[12px] leading-[18px]"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:bg-[#4361ee]/20 rounded-full p-0.5"
                      >
                        <svg
                          className="w-3 h-3"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M9 3L3 9M3 3L9 9"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add Tags"
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                    className="flex-1 px-3 py-2 border border-[#e9eaeb] rounded-lg 
                             font-inter text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#535862]
                             focus:outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]"
                  />
                  <Button
                    variant="outline"
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* Upload Area - Always visible */}
              <div
                className={`
                  bg-white border border-[#e9eaeb] rounded-xl 
                  flex flex-col items-center justify-center gap-3 px-6 py-4 min-h-[120px]
                  transition-all duration-200 cursor-pointer
                  ${
                    isDragOver
                      ? "border-[#4361ee] bg-[#4361ee]/5"
                      : "hover:border-gray-300"
                  }
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleUploadClick}
              >
                {/* Featured Icon */}
                <div className="bg-[#f5f5f5] relative rounded-[28px] w-10 h-10 flex items-center justify-center">
                  <div className="absolute border-[6px] border-[#fafafa] border-solid inset-[-3px] pointer-events-none rounded-[31px]" />
                  <UploadCloudIcon className="w-5 h-5" />
                </div>

                {/* Text Content */}
                <div className="flex flex-col gap-1 items-center text-center">
                  <div className="flex items-center gap-1">
                    <span className="font-inter font-semibold text-[14px] leading-[20px] text-[#4361ee] cursor-pointer">
                      Click to upload
                    </span>
                    <span className="font-inter font-normal text-[14px] leading-[20px] text-[#535862]">
                      or drag and drop
                    </span>
                  </div>
                  <p className="font-inter font-normal text-[12px] leading-[18px] text-[#535862] text-center">
                    SVG, PNG, JPG or GIF (max. 800×400px)
                  </p>
                </div>
              </div>

              {/* File Queue - Show when files are selected/uploaded */}
              {(modalState === "uploading" || modalState === "uploaded") &&
                uploadedFiles.length > 0 && (
                  <div
                    className={`flex flex-col gap-3 scrollable-file-list ${
                      uploadedFiles.length > 4
                        ? "max-h-[320px] overflow-y-auto pr-2 -mr-2"
                        : ""
                    }`}
                  >
                    {uploadedFiles.map((uploadedFile, index) => (
                      <div
                        key={uploadedFile.id}
                        className="bg-white border border-[#5350ec] rounded-xl p-4 relative flex-shrink-0"
                      >
                        <div className="flex gap-4 items-start">
                          {/* File Icon */}
                          <div className="shrink-0 w-7 h-7 relative">
                            <div className="absolute bg-[#f4ebff] left-[-2px] top-[-2px] w-8 h-8 rounded-[28px] flex items-center justify-center">
                              <div className="absolute border-4 border-[#f9f5ff] border-solid inset-[-2px] pointer-events-none rounded-[30px]" />
                              <FileIcon className="w-4 h-4" />
                            </div>
                          </div>

                          {/* File Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col gap-1">
                              <p
                                className="font-inter font-medium text-[14px] leading-[20px] text-[#414651]"
                                title={uploadedFile.file.name}
                              >
                                {truncateFileName(uploadedFile.file.name)}
                              </p>
                              <p className="font-inter font-normal text-[14px] leading-[20px] text-[#535862]">
                                {(uploadedFile.file.size / 1024).toFixed(0)} KB
                              </p>
                            </div>

                            {/* Progress Bar with exact Figma gradient */}
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex-1 relative">
                                {/* Background */}
                                <div className="absolute h-2 left-0 right-0 top-0 bg-[#E9EAEB] rounded-[4px]" />

                                {/* Progress with Figma gradient */}
                                <div
                                  className="absolute h-2 top-0 rounded-[8px] transition-all duration-300"
                                  style={{
                                    left: "0%",
                                    width:
                                      modalState === "uploading" &&
                                      uploadingFileIds.includes(uploadedFile.id)
                                        ? `${uploadProgress}%`
                                        : "100%",
                                    background:
                                      "linear-gradient(120.99deg, #3A0CA3 0%, rgba(67, 97, 238, 0.4) 63.07%)",
                                  }}
                                />
                              </div>
                              <span className="font-inter font-medium text-[14px] leading-[20px] text-[#414651] text-nowrap whitespace-pre">
                                {modalState === "uploading" &&
                                uploadingFileIds.includes(uploadedFile.id)
                                  ? `${uploadProgress}%`
                                  : "100%"}
                              </span>
                            </div>
                          </div>

                          {/* Checkbox - Only show when completed */}
                          {(modalState === "uploaded" ||
                            (modalState === "uploading" &&
                              !uploadingFileIds.includes(uploadedFile.id))) && (
                            <div className="absolute top-4 right-4">
                              <CheckIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Actions - Fixed at bottom */}
        <div className="flex-shrink-0 pt-8 pb-6 px-6 bg-white rounded-b-[20px]">
          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={
                modalState === "uploaded" ? handleUploadMore : handleCancel
              }
              className="flex-1"
            >
              {modalState === "uploaded" ? "Upload More" : "Cancel"}
            </Button>
            <Button
              variant="gradient"
              fullWidth
              onClick={handleNext}
              disabled={
                modalState === "empty" ||
                modalState === "uploading" ||
                (modalState === "describing" && !tempDescription.trim())
              }
              className="flex-1"
            >
              {modalState === "describing"
                ? currentFileIndex < uploadedFiles.length - 1
                  ? "Next"
                  : "Submit"
                : "Next"}
            </Button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* CSS for custom scrollbar styling */}
      <style>{`
        .scrollable-file-list {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .scrollable-file-list::-webkit-scrollbar {
          width: 6px;
        }

        .scrollable-file-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollable-file-list::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 3px;
        }

        .scrollable-file-list::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }

        .scrollable-content {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .scrollable-content::-webkit-scrollbar {
          width: 6px;
        }

        .scrollable-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollable-content::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 3px;
        }

        .scrollable-content::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
