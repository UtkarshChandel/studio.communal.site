"use client";

import React, { useState } from "react";
import Button from "./Button";
import FileUploadModal from "./FileUploadModal";

export default function FileUploadModalExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileUpload = (files: File[]) => {
    console.log("Files uploaded:", files);
    // Handle file upload logic here
  };

  return (
    <div className="p-8">
      <Button onClick={() => setIsModalOpen(true)}>
        Open File Upload Modal
      </Button>

      <FileUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
}
