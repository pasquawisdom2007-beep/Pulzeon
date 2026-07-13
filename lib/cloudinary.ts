import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  )
}

/**
 * Upload a data URI (base64) to Cloudinary and return the secure URL.
 */
export async function uploadDataUri(dataUri: string, folder = "pulzeon"): Promise<string> {
  const res = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "auto",
  })
  return res.secure_url
}

export { cloudinary }
