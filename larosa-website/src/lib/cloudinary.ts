import { v2 as cloudinary } from "cloudinary";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 10 * 1024 * 1024;

function getConfig() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const api_key = process.env.CLOUDINARY_API_KEY?.trim();
  const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error("Cloudinary is not configured");
  }
  return { cloud_name, api_key, api_secret };
}

export function assertImageFile(file: File) {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("Only JPEG, PNG, and WebP images are allowed");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 10 MB or smaller");
  }
}

export type UploadResult = {
  url: string;
  publicId: string;
};

export async function uploadRoomImage(
  buffer: Buffer,
  filename: string,
  roomId?: number
): Promise<UploadResult> {
  const { cloud_name, api_key, api_secret } = getConfig();
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });

  const baseFolder =
    process.env.CLOUDINARY_UPLOAD_FOLDER?.trim() || "larosa/villas";
  const folder = roomId ? `${baseFolder}/${roomId}` : `${baseFolder}/draft`;

  const result = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        public_id: filename.replace(/\.[^.]+$/, "").replace(/[^\w-]+/g, "-"),
        overwrite: false,
        unique_filename: true,
      },
      (error, uploadResult) => {
        if (error || !uploadResult) {
          reject(error ?? new Error("Upload failed"));
          return;
        }
        resolve(uploadResult);
      }
    );
    stream.end(buffer);
  });

  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteRoomImage(publicId: string): Promise<void> {
  const { cloud_name, api_key, api_secret } = getConfig();
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}
