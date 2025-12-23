import React, { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { cn } from "../lib/utils";
import axios from "axios";

const FileUpload = ({ onAnalysisComplete, applicantName, applicantEmail }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const trimmedName = applicantName?.trim() || "";
  const trimmedEmail = applicantEmail?.trim() || "";

  const hasFullName = (value) => {
    const parts = value.split(/\s+/).filter(Boolean);
    return parts.length >= 2;
  };

  const isValidEmail = (value) => {
    if (!value) {
      return false;
    }
    const [local, domain] = value.split("@");
    return Boolean(local && domain && domain.includes("."));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    if (!trimmedName || !trimmedEmail) {
      setError("Please enter your full name and email before uploading.");
      return;
    }
    if (!hasFullName(trimmedName)) {
      setError("Please enter both your first and last name.");
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or DOCX file.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", trimmedName);
    formData.append("email", trimmedEmail);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onAnalysisComplete(response.data);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ease-in-out",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/50",
          isUploading ? "opacity-50 pointer-events-none" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept=".pdf,.docx,.doc"
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <div className="space-y-1">
              <p className="font-medium text-lg">Analyzing your resume...</p>
              <p className="text-sm text-muted-foreground">Extracting impact metrics and structural data.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-foreground">
                Drop your resume here
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Support for PDF and DOCX. We analyze against 50+ ATS and hiring data points.
              </p>
            </div>
            <Button variant="outline" className="mt-4">
              Or Select File
            </Button>
          </div>
        )}
      </div>
      {error && (
        <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;

