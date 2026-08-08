/**
 * Browser-side image compression for admin uploads.
 *
 * Product photos come straight off a camera or phone at 3–8MB. Stored at that
 * size they blow through Supabase's egress quota, because the image optimiser
 * re-downloads the full original for every variant it generates. Compressing
 * before upload keeps storage small without any visible quality loss —
 * 1800px is still well above what the product gallery needs, even zoomed.
 */

export const MAX_WIDTH = 1800;
export const QUALITY = 0.85;

export interface CompressResult {
  file: File;
  originalBytes: number;
  compressedBytes: number;
}

/**
 * Resizes and re-encodes an image to JPEG. Falls back to the original file if
 * anything goes wrong, or if compression wouldn't actually save space — an
 * upload should never fail just because compression did.
 */
export async function compressImage(file: File): Promise<CompressResult> {
  const unchanged: CompressResult = {
    file,
    originalBytes: file.size,
    compressedBytes: file.size,
  };

  if (!file.type.startsWith("image/") || typeof createImageBitmap !== "function") {
    return unchanged;
  }

  try {
    // `from-image` applies EXIF orientation, so phone photos aren't sideways.
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });

    const scale = Math.min(1, MAX_WIDTH / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return unchanged;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALITY)
    );
    if (!blob || blob.size >= file.size) return unchanged;

    const base = file.name.replace(/\.[^.]+$/, "");
    return {
      file: new File([blob], `${base}.jpeg`, { type: "image/jpeg" }),
      originalBytes: file.size,
      compressedBytes: blob.size,
    };
  } catch {
    return unchanged;
  }
}
