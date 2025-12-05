import React, { useCallback } from 'react';
import { useChat } from '../context/ChatContext';
import { Upload, Loader2, FileText } from 'lucide-react';

export default function FileUpload() {
  const { handleUpload, isUploading } = useChat();

  const onFileChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    try {
      await handleUpload(file);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload resume');
    }
  }, [handleUpload]);

  return (
    <div className="relative group">
      <input
        type="file"
        accept=".pdf"
        onChange={onFileChange}
        disabled={isUploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
      />
      <div className={`
        flex items-center justify-center gap-2 w-full p-3 rounded-xl border border-dashed transition-all duration-200
        ${isUploading 
          ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
          : 'bg-white dark:bg-gray-900 border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
        }
      `}>
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
              Upload PDF
            </span>
          </>
        )}
      </div>
    </div>
  );
}
