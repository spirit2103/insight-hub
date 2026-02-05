import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadDocument, fetchDocumentStatus } from "@/lib/api"; // Import the uploadDocument API function

interface UploadedFile {
  id: string; // This will now be the Firestore document ID
  name: string;
  size: number;
  status: "uploaded" | "processing" | "completed" | "failed"; // Reflecting backend statuses
  progress: number; // Still useful for initial upload phase
}

interface DocumentUploadProps {
  onUploadSuccess?: () => void; // Callback to refresh dashboard data
}

export function DocumentUpload({ onUploadSuccess }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const pollStatus = (storedName: string, localId: string, attempt = 0) => {
    if (attempt > 120) return;
    setTimeout(async () => {
      try {
        const statusResponse = await fetchDocumentStatus(storedName);
        const status = statusResponse?.status;
        if (status === "completed" || status === "failed") {
          setUploadedFiles(prev =>
            prev.map(f => f.id === localId ? { ...f, status: status as UploadedFile["status"] } : f)
          );
          onUploadSuccess?.();
          return;
        }
      } catch (error) {
        console.error("Error polling document status:", error);
      }
      pollStatus(storedName, localId, attempt + 1);
    }, 2000);
  };

  const uploadFileToServer = async (file: File) => {
    const id = file.name + Date.now(); // Temporary ID before we get Firestore ID
    const newFile: UploadedFile = {
      id,
      name: file.name,
      size: file.size,
      status: "uploaded", // Initial status before actual upload starts
      progress: 0,
    };
    setUploadedFiles(prev => [...prev, newFile]);

    try {
      // Simulate upload progress (only for visual feedback before actual call)
      let progress = 0;
      const uploadInterval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 90) {
          progress = 90; // Stop before 100 to show processing
          clearInterval(uploadInterval);
        }
        setUploadedFiles(prev =>
          prev.map(f => f.id === id ? { ...f, progress } : f)
        );
      }, 100);

      try {
        const response = await uploadDocument(file);
        clearInterval(uploadInterval); // Ensure interval is cleared

        const storedName = response.stored_filename || id;
        setUploadedFiles(prev =>
          prev.map(f => f.id === id ? { ...f, id: storedName, status: "processing", progress: 100 } : f)
        );
        pollStatus(storedName, storedName);
      } catch (uploadError) {
        console.error("Error uploading file:", uploadError);
        clearInterval(uploadInterval);
        setUploadedFiles(prev =>
          prev.map(f => f.id === id ? { ...f, status: "failed", progress: 100 } : f)
        );
      }

    } catch (error) {
      console.error("General error during file upload preparation:", error);
      setUploadedFiles(prev =>
        prev.map(f => f.id === id ? { ...f, status: "failed", progress: 100 } : f)
      );
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach(uploadFileToServer);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(uploadFileToServer);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploaded":
        return <Loader2 className="w-4 h-4 animate-spin text-info" />;
      case "processing":
        return <Loader2 className="w-4 h-4 animate-spin text-processing" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusText = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploaded":
        return "Uploading...";
      case "processing":
        return "Processing...";
      case "completed":
        return "Ready";
      case "failed":
        return "Failed";
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all",
          isDragging
            ? "border-accent bg-accent/5"
            : "border-border hover:border-accent/50 hover:bg-secondary/30"
        )}
      >
        <input
          type="file"
          id="document-upload-input"
          multiple
          accept=".pdf,.docx,.doc,.txt,.md"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
            isDragging ? "bg-accent text-accent-foreground" : "bg-secondary"
          )}>
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports PDF, DOCX, TXT, MD • Max 50MB per file
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border"
            >
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {file.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </span>
                  {file.status === "uploaded" && file.progress < 100 && (
                    <div className="flex-1 max-w-24 h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusIcon(file.status)}
                <span className={cn(
                  "text-xs font-medium",
                  file.status === "completed" && "text-success",
                  file.status === "processing" && "text-processing",
                  file.status === "uploaded" && "text-info",
                  file.status === "failed" && "text-destructive"
                )}>
                  {getStatusText(file.status)}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => removeFile(file.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
