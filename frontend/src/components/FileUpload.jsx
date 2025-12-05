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
          ? 'bg-gray-50 dark:bg-[#2f2f2f] border-gray-200 dark:border-white/5' 
          : 'bg-white dark:bg-[#2f2f2f] border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-[#3f3f3f]'
        }
      `}>
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-500">Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200">
              Upload PDF
            </span>
          </>
        )}
      </div>
    </div>
  );
}
