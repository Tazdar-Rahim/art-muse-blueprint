import React, { useCallback, useState } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  onUrlsChange: (urls: string[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  existingUrls?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  onUrlsChange,
  accept = "image/*",
  multiple = true,
  maxFiles = 5,
  existingUrls = []
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(existingUrls);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      handleFiles(imageFiles);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    const totalFiles = selectedFiles.length + files.length;
    if (totalFiles > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);
    onFilesChange(newFiles);

    // Create preview URLs for new files
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    const updatedPreviews = [...previewUrls, ...newPreviewUrls];
    setPreviewUrls(updatedPreviews);
    onUrlsChange(updatedPreviews);
  }, [selectedFiles, maxFiles, onFilesChange, previewUrls, onUrlsChange]);

  const removeFile = useCallback((index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
    onFilesChange(newFiles);
    onUrlsChange(newPreviews);
  }, [selectedFiles, previewUrls, onFilesChange, onUrlsChange]);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragOver && "border-primary bg-primary/5",
          "hover:border-primary hover:bg-primary/5"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          Drag and drop images here, or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Maximum {maxFiles} files • PNG, JPG, WEBP up to 10MB each
        </p>
        <input
          id="file-input"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {selectedFiles.length} file(s) selected
        </div>
      )}
    </div>
  );
};