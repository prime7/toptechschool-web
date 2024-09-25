"use client";
import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadStatus("uploading");

    try {
      const res = await axios.post("/api/file-upload", {
        filename: file.name,
        fileType: file.type,
      });
      const url = res.data.signedUrl;
      await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });
      setUploadStatus("success");
      router.push(`/upload/feedback/${res.data.resumeId}`);
    } catch (err) {
      console.log(err);
      setUploadStatus("error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-light-text">
          Resume Upload
        </h2>
        <p className="text-center text-light-secondary">
          Upload your resume to get ATS-friendly feedback and improve your
          chances of landing an interview.
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <Label
              htmlFor="resume"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-light-border border-dashed rounded-lg cursor-pointer bg-light-hover hover:bg-light-primary/10"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-light-muted" />
                <p className="mb-2 text-sm text-light-secondary">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-light-muted">
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
            <p className="text-sm text-light-secondary text-center">
              Selected file: {fileName}
            </p>
          )}
          {uploadStatus === "uploading" && (
            <div className="flex items-center justify-center text-light-primary">
              <AlertCircle className="animate-spin mr-2" />
              Uploading...
            </div>
          )}
          {uploadStatus === "success" && (
            <div className="flex items-center justify-center text-green-500">
              <CheckCircle className="mr-2" />
              Upload successful!
            </div>
          )}
          {uploadStatus === "error" && (
            <div className="flex items-center justify-center text-red-500">
              <AlertCircle className="mr-2" />
              Upload failed. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
