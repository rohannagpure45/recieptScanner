import { useRef, useState, useEffect, DragEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../context/WizardContext';

const ACCEPTED = ['image/png', 'image/jpeg', 'image/jpg', 'image/heic', 'image/heif'];
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB
const WARN_FILE_BYTES = 4 * 1024 * 1024; // Warn above 4MB

function formatMB(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function DragDropZone() {
  const { receiptFile, setReceiptFile } = useWizard();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [warning, setWarning] = useState<string>();
  const [error, setError] = useState<string>();

  const validateFile = (file: File): boolean => {
    setError(undefined);
    setWarning(undefined);

    const mime = (file.type || '').toLowerCase();
    let ok = !!mime && ACCEPTED.includes(mime);
    if (!ok) {
      const lower = (file.name || '').toLowerCase();
      if (!mime && (lower.endsWith('.heic') || lower.endsWith('.heif'))) {
        ok = true;
      }
    }
    if (!ok) {
      setError('Unsupported file type. Please upload PNG, JPG, or HEIC/HEIF.');
      return false;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(`File is too large (${formatMB(file.size)}). Maximum allowed is ${formatMB(MAX_FILE_BYTES)}.`);
      return false;
    }

    if (file.size > WARN_FILE_BYTES) {
      setWarning(
        `Large image detected (${formatMB(file.size)}). We will downscale and compress before parsing to reduce cost and time.`
      );
    }

    return true;
  };

  const handleFile = (file: File) => {
    if (!validateFile(file)) return;

    setReceiptFile(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="space-y-4">
      <motion.div
        className={`relative rounded-xl border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? 'border-brand bg-brand/10 scale-[1.02] shadow-brand'
            : error
            ? 'border-error bg-error/5 animate-shake'
            : 'border-slate-700 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/60'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        whileHover={{ scale: receiptFile ? 1 : 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          aria-label="Upload receipt image"
        />

        {!receiptFile ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <motion.div
              className="mb-4 rounded-full bg-brand/10 p-4"
              animate={isDragging ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
              transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
            >
              <svg
                className="h-12 w-12 text-brand"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </motion.div>
            <h3 className="mb-2 text-lg font-semibold text-slate-200">
              {isDragging ? 'Drop your receipt here' : 'Upload Receipt'}
            </h3>
            <p className="mb-4 text-sm text-slate-400">
              Drag and drop an image, or{' '}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-brand hover:text-brand-light underline focus:outline-none focus:ring-2 focus:ring-brand rounded"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-slate-500">
              Supports PNG, JPG, HEIC/HEIF (max {formatMB(MAX_FILE_BYTES)})
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="flex-shrink-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <div className="rounded-lg bg-success/10 p-2">
                      <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{receiptFile.name}</p>
                    <p className="text-xs text-slate-400">{formatMB(receiptFile.size)}</p>
                  </div>
                </div>
                {previewUrl && (
                  <motion.div
                    className="mt-4 rounded-lg overflow-hidden border border-slate-800"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <img
                      src={previewUrl}
                      alt="Receipt preview"
                      className="max-h-64 w-full object-contain bg-slate-950"
                    />
                  </motion.div>
                  )}
              </div>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="btn-secondary text-sm touch-target"
                aria-label="Replace file"
              >
                Replace
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-2 rounded-lg border border-error/50 bg-error/10 p-3"
            role="alert"
            aria-live="polite"
          >
            <svg className="h-5 w-5 text-error flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-error">{error}</p>
          </motion.div>
        )}
        {warning && !error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-2 rounded-lg border border-warning/50 bg-warning/10 p-3"
            role="alert"
            aria-live="polite"
          >
            <svg className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-warning">{warning}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

