import { useEffect, useRef, useState } from 'react';
import { useWizard } from '../context/WizardContext';

const ACCEPTED = ['image/png', 'image/jpeg', 'image/jpg', 'image/heic', 'image/heif'];
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB (matches backend/multer limit)
const WARN_FILE_BYTES = 4 * 1024 * 1024; // Warn above 4MB

function formatMB(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ReceiptUploader() {
  const { receiptFile, setReceiptFile } = useWizard();
  const inputRef = useRef<HTMLInputElement>(null);
  const currentFileIdRef = useRef(0);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [warning, setWarning] = useState<string>();
  const [error, setError] = useState<string>();
  const [origDims, setOrigDims] = useState<{ w: number; h: number } | undefined>();
  const [estDims, setEstDims] = useState<{ w: number; h: number } | undefined>();
  const [estBytes, setEstBytes] = useState<number | undefined>();
  const [estMime, setEstMime] = useState<string | undefined>();
  const [previewSupported, setPreviewSupported] = useState<boolean>(true);

  const handleFile = (file?: File) => {
    if (!file) return;
    const fileId = ++currentFileIdRef.current;
    setError(undefined);
    setWarning(undefined);
    setOrigDims(undefined);
    setEstDims(undefined);
    setEstBytes(undefined);
    setEstMime(undefined);
    setPreviewSupported(true);

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
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(`File is too large (${formatMB(file.size)}). Maximum allowed is ${formatMB(MAX_FILE_BYTES)}.`);
      return;
    }

    if (file.size > WARN_FILE_BYTES) {
      setWarning(
        `Large image detected (${formatMB(file.size)}). We will downscale and compress before parsing to reduce cost and time.`
      );
    }

    setReceiptFile(file);
    // Revoke any previous preview URL before setting a new one
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    // Attempt to read intrinsic dimensions and estimate downscaled size
    // Note: HEIC/HEIF may not preview in some browsers; estimation will be skipped.
    const img = new Image();
    img.onload = async () => {
      if (fileId !== currentFileIdRef.current) {
        // Stale callback from a previous file selection
        return;
      }
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      setOrigDims({ w, h });

      // Compute estimated target dims (max width 1600, keep aspect)
      const maxW = 1600;
      let estW = w;
      let estH = h;
      if (w > maxW) {
        const scale = maxW / w;
        estW = Math.round(w * scale);
        estH = Math.round(h * scale);
      }
      setEstDims({ w: estW, h: estH });

      try {
        const canvas = document.createElement('canvas');
        canvas.width = estW;
        canvas.height = estH;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, estW, estH);
          const lower = (file.name || '').toLowerCase();
          const mimeGuess = (file.type || '').toLowerCase();
          const isPng = /png/i.test(mimeGuess) || (!mimeGuess && lower.endsWith('.png'));
          const targetMime = isPng ? 'image/png' : 'image/jpeg';
          const blob: Blob | null = await new Promise((resolve) =>
            canvas.toBlob(resolve, targetMime, isPng ? undefined : 0.75)
          );
          if (blob) {
            setEstBytes(blob.size);
            setEstMime(targetMime);
          }
        }
      } catch {
        // ignore estimation errors
      }
    };
    img.onerror = () => {
      if (fileId !== currentFileIdRef.current) return;
      setPreviewSupported(false);
    };
    img.src = url;
  };

  useEffect(() => {
    // Revoke preview URL on unmount
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, []);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
      <p className="text-sm text-slate-300">Upload a clear photo of the receipt.</p>
      <input
        ref={inputRef}
        className="mt-3 block w-full text-sm"
        type="file"
        accept="image/*"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      {(error || warning) && (
        <div className="mt-3 space-y-1">
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!error && warning && <p className="text-sm text-yellow-400">{warning}</p>}
        </div>
      )}
      {receiptFile && (
        <div className="mt-4 text-sm text-slate-200">
          <div className="flex items-center justify-between">
            <p>
              Selected: {receiptFile.name}{' '}
              <span className="text-slate-400">({formatMB(receiptFile.size)})</span>
            </p>
            <button className="text-brand" onClick={() => inputRef.current?.click()}>
              Replace file
            </button>
          </div>
          <div className="mt-2 grid gap-1 text-xs text-slate-400">
            {origDims && (
              <p>
                Original: {origDims.w}×{origDims.h} • {formatMB(receiptFile.size)}
              </p>
            )}
            {estDims && (
              <p>
                Estimated upload: {estDims.w}×{estDims.h}
                {typeof estBytes === 'number' && (
                  <>
                    {' '}
                    • ~{formatMB(estBytes)} ({estMime})
                  </>
                )}
              </p>
            )}
          </div>
          {previewUrl && (
            <div className="mt-3">
              {previewSupported ? (
                <img
                  src={previewUrl}
                  alt="Receipt preview"
                  className="max-h-48 w-auto rounded-md border border-slate-800 object-contain"
                />
              ) : (
                <p className="text-xs text-yellow-400">
                  Preview not supported for this image format in your browser. The server will still
                  process it.
                </p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                Preview is downscaled for display; the server also downsizes and compresses before parsing.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
