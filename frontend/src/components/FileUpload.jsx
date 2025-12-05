import React, { useRef } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { motion } from 'framer-motion';

export default function FileUpload() {
  const { handleUpload, isUploading } = useChat();
  const fileInputRef = useRef(null);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept=".pdf"
        className="hidden"
        ref={fileInputRef}
        onChange={onFileChange}
      />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300"
      >
        {isUploading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Upload className="w-5 h-5" />
        )}
        <span className="font-medium">
          {isUploading ? 'Uploading...' : 'Upload Resume (PDF)'}
        </span>
      </motion.button>
      <p className="text-xs text-center mt-2 text-gray-400">
        Upload to chat with a specific resume
      </p>
    </div>
  );
}
