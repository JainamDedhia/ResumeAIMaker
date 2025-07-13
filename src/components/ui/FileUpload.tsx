import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, File, X } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  onFileRemove?: () => void;
  acceptedFileTypes?: string[];
  maxSize?: number;
  currentFile?: File | null;
  label: string;
  description: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  onFileRemove,
  acceptedFileTypes = ['.pdf', '.doc', '.docx'],
  maxSize = 10 * 1024 * 1024, // 10MB
  currentFile,
  label,
  description
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    multiple: false
  });

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {label}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      {currentFile ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  {currentFile.name}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {(currentFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {onFileRemove && (
              <motion.button
                onClick={onFileRemove}
                className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10
            ${isDragActive 
              ? 'border-cyan-400 bg-cyan-50/50 dark:bg-cyan-900/10' 
              : 'border-gray-300 dark:border-gray-600'
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            or click to browse
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Supported formats: {acceptedFileTypes.join(', ')} 
            <br />
            Max size: {(maxSize / 1024 / 1024).toFixed(0)}MB
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;