"use client";

import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Upload, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const UploadComponent: React.FC = () => {
  const router = useRouter();
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("File size exceeds 5MB limit");
      return false;
    }

    const validTypes = ["application/pdf", "application/msword"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Invalid file type. Please upload PDF or DOC");
      return false;
    }

    return true;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    if (!validateFile(file)) {
      setUploadStatus("error");
      return;
    }

    setFileName(file.name);
    setUploadStatus("uploading");

    try {
      const { data } = await axios.post("/api/file-upload", {
        filename: file.name,
        fileType: file.type,
      });

      await axios.put(data.signedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      setUploadStatus("success");
      router.push(`/resume/${data.resumeId}`);
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage("Failed to upload file. Please try again.");
      setUploadStatus("error");
    }
  };

  const getStatusDisplay = () => {
    switch (uploadStatus) {
      case "uploading":
        return (
          <div className="flex items-center justify-center text-primary">
            <Loader2 className="animate-spin mr-2" />
            Uploading...
          </div>
        );
      case "success":
        return (
          <div className="flex items-center justify-center text-green-500">
            <CheckCircle className="mr-2" />
            Upload successful!
          </div>
        );
      case "error":
        return (
          <div className="flex items-center justify-center text-destructive">
            <AlertCircle className="mr-2" />
            {errorMessage || "Upload failed. Please try again."}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <Label
          htmlFor="resume"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent hover:bg-opacity-50 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, DOC, or DOCX (MAX. 5MB)
            </p>
          </div>
          <Input
            id="resume"
            type="file"
            className="hidden"
            onChange={handleUpload}
            accept=".pdf,.doc,.docx"
          />
        </Label>
      </div>
      {fileName && (
        <p className="text-sm text-muted-foreground text-center">
          Selected file: {fileName}
        </p>
      )}
      {getStatusDisplay()}
    </div>
  );
};

export default UploadComponent;
