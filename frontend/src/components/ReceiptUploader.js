import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { useWizard } from '../context/WizardContext';
const ACCEPTED = ['image/png', 'image/jpeg', 'image/jpg', 'image/heic', 'image/heif'];
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB (matches backend/multer limit)
const WARN_FILE_BYTES = 4 * 1024 * 1024; // Warn above 4MB
function formatMB(bytes) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
export function ReceiptUploader() {
    const { receiptFile, setReceiptFile } = useWizard();
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState();
    const [warning, setWarning] = useState();
    const [error, setError] = useState();
    const [origDims, setOrigDims] = useState();
    const [estDims, setEstDims] = useState();
    const [estBytes, setEstBytes] = useState();
    const [estMime, setEstMime] = useState();
    const [previewSupported, setPreviewSupported] = useState(true);
    const handleFile = (file) => {
        if (!file)
            return;
        setError(undefined);
        setWarning(undefined);
        setOrigDims(undefined);
        setEstDims(undefined);
        setEstBytes(undefined);
        setEstMime(undefined);
        setPreviewSupported(true);
        if (!ACCEPTED.includes(file.type.toLowerCase())) {
            setError('Unsupported file type. Please upload PNG, JPG, or HEIC/HEIF.');
            return;
        }
        if (file.size > MAX_FILE_BYTES) {
            setError(`File is too large (${formatMB(file.size)}). Maximum allowed is ${formatMB(MAX_FILE_BYTES)}.`);
            return;
        }
        if (file.size > WARN_FILE_BYTES) {
            setWarning(`Large image detected (${formatMB(file.size)}). We will downscale and compress before parsing to reduce cost and time.`);
        }
        setReceiptFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        // Attempt to read intrinsic dimensions and estimate downscaled size
        // Note: HEIC/HEIF may not preview in some browsers; estimation will be skipped.
        const img = new Image();
        img.onload = async () => {
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
                    const targetIsPng = /png/i.test(file.type);
                    const targetMime = targetIsPng ? 'image/png' : 'image/jpeg';
                    const blob = await new Promise((resolve) => canvas.toBlob(resolve, targetMime, targetIsPng ? undefined : 0.75));
                    if (blob) {
                        setEstBytes(blob.size);
                        setEstMime(targetMime);
                    }
                }
            }
            catch {
                // ignore estimation errors
            }
        };
        img.onerror = () => {
            setPreviewSupported(false);
        };
        img.src = url;
    };
    useEffect(() => {
        return () => {
            if (previewUrl)
                URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);
    return (_jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-900/40 p-6", children: [_jsx("p", { className: "text-sm text-slate-300", children: "Upload a clear photo of the receipt." }), _jsx("input", { ref: inputRef, className: "mt-3 block w-full text-sm", type: "file", accept: "image/*", onChange: (event) => handleFile(event.target.files?.[0]) }), (error || warning) && (_jsxs("div", { className: "mt-3 space-y-1", children: [error && _jsx("p", { className: "text-sm text-red-400", children: error }), !error && warning && _jsx("p", { className: "text-sm text-yellow-400", children: warning })] })), receiptFile && (_jsxs("div", { className: "mt-4 text-sm text-slate-200", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("p", { children: ["Selected: ", receiptFile.name, ' ', _jsxs("span", { className: "text-slate-400", children: ["(", formatMB(receiptFile.size), ")"] })] }), _jsx("button", { className: "text-brand", onClick: () => inputRef.current?.click(), children: "Replace file" })] }), _jsxs("div", { className: "mt-2 grid gap-1 text-xs text-slate-400", children: [origDims && (_jsxs("p", { children: ["Original: ", origDims.w, "\u00D7", origDims.h, " \u2022 ", formatMB(receiptFile.size)] })), estDims && (_jsxs("p", { children: ["Estimated upload: ", estDims.w, "\u00D7", estDims.h, typeof estBytes === 'number' && (_jsxs(_Fragment, { children: [' ', "\u2022 ~", formatMB(estBytes), " (", estMime, ")"] }))] }))] }), previewUrl && (_jsxs("div", { className: "mt-3", children: [previewSupported ? (_jsx("img", { src: previewUrl, alt: "Receipt preview", className: "max-h-48 w-auto rounded-md border border-slate-800 object-contain" })) : (_jsx("p", { className: "text-xs text-yellow-400", children: "Preview not supported for this image format in your browser. The server will still process it." })), _jsx("p", { className: "mt-1 text-xs text-slate-400", children: "Preview is downscaled for display; the server also downsizes and compresses before parsing." })] }))] }))] }));
}
