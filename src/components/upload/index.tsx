"use client";

import React, { useState, useCallback } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { JobRole } from "@prisma/client";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const UploadComponent: React.FC = () => {
  const router = useRouter();
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedJobRole, setSelectedJobRole] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("File size exceeds 5MB limit");
      return false;
    }

    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Invalid file type. Please upload PDF, DOC, or DOCX");
      return false;
    }

    return true;
  };

  const handleFileSelect = (selectedFile: File) => {
    setErrorMessage(null);
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setUploadStatus("idle");
    } else {
      setUploadStatus("error");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Please select a file to upload");
      setUploadStatus("error");
      return;
    }

    if (!selectedJobRole) {
      setErrorMessage("Please select a job role before uploading");
      setUploadStatus("error");
      return;
    }

    setUploadStatus("uploading");

    try {
      const { data } = await axios.post("/api/file-upload", {
        filename: file.name,
        fileType: file.type,
        jobRole: selectedJobRole,
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Job Role</label>
        <Select 
          name="jobRole" 
          required 
          onValueChange={(value) => setSelectedJobRole(value)}
        >
          <SelectTrigger className="w-full h-12">
            <SelectValue placeholder="Choose your target position" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(JobRole).map((role) => (
              <SelectItem
                key={role}
                value={role}
                className="hover:bg-primary/10"
              >
                {role.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {uploadStatus === "error" && !selectedJobRole && (
          <p className="text-sm text-destructive mt-1">
            Please select a job role
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Upload Resume</label>
        <div 
          className={`flex items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "hover:bg-accent hover:bg-opacity-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('resume-upload')?.click()}
        >
          <div className="flex flex-col items-center justify-center py-8 px-4">
            {file ? (
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-primary/10 mb-3">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <p className="font-medium text-center">{fileName}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click or drag to replace
                </p>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-full bg-primary/10 mb-3">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="mb-2 text-sm font-medium">
                  {isDragging ? "Drop your file here" : "Drag and drop your resume"}
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  or <span className="text-primary font-medium">browse files</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  PDF, DOC, or DOCX (MAX. 5MB)
                </p>
              </>
            )}
          </div>
          <Input
            id="resume-upload"
            type="file"
            className="hidden"
            onChange={handleInputChange}
            accept=".pdf,.doc,.docx"
          />
        </div>
      </div>

      {file && (
        <Button 
          onClick={handleUpload} 
          className="w-full h-12"
          disabled={uploadStatus === "uploading" || !selectedJobRole || errorMessage !== null}
        >
          {uploadStatus === "uploading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Get Feedback 😎"
          )}
        </Button>
      )}

      <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <span>💡</span>
          <span>
            Tip: Make sure your resume is in PDF format for best results
          </span>
        </p>
      </div>
    </div>
  );
};

export default UploadComponent;
