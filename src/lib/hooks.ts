import { useState } from "react";
import { supabase } from "./supabase";

const MAX_FILE_SIZE = 128 * 1024; // 128kb
const ALLOWED_TYPE = "image/jpeg";

export function useCampaignMedia(campaignId: string, userId: string) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 📤 Upload image
  const uploadImage = async (file: File) => {
    setError(null);

    if (file.type !== ALLOWED_TYPE) {
      setError("Only JPG images are allowed");
      return null;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be smaller than 128kb");
      return null;
    }

    try {
      setUploading(true);

      const filePath = `${userId}/${campaignId}/${crypto.randomUUID()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("campaign-media")
        .upload(filePath, file, {
          contentType: "image/jpeg",
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("campaign-media")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to upload image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // 📥 List images for campaign
  const listImages = async () => {
    const { data, error } = await supabase.storage
      .from("campaign-media")
      .list(`${userId}/${campaignId}`, {
        sortBy: { column: "created_at", order: "desc" }
      });

    if (error) {
      console.error(error);
      setError("Failed to load images");
      return [];
    }

    return data.map(file => ({
      name: file.name,
      url: supabase.storage
        .from("campaign-media")
        .getPublicUrl(`${userId}/${campaignId}/${file.name}`).data.publicUrl
    }));
  };

  // 🗑 Delete image
  const deleteImage = async (fileName: string) => {
    const { error } = await supabase.storage
      .from("campaign-media")
      .remove([`${userId}/${campaignId}/${fileName}`]);

    if (error) {
      console.error(error);
      setError("Failed to delete image");
    }
  };

  return {
    uploadImage,
    listImages,
    deleteImage,
    uploading,
    error
  };
}
