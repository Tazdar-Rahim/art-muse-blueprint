import { supabase } from '@/integrations/supabase/client';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

/**
 * Upload a single file to Supabase Storage
 */
export const uploadFile = async (
  file: File,
  bucket: string,
  path?: string
): Promise<UploadResult> => {
  try {
    // Generate a unique filename if no path provided
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop();
    const fileName = path || `${timestamp}-${randomString}.${extension}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: '', path: '', error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { 
      url: '', 
      path: '', 
      error: error instanceof Error ? error.message : 'Upload failed' 
    };
  }
};

/**
 * Upload multiple files to Supabase Storage
 */
export const uploadMultipleFiles = async (
  files: File[],
  bucket: string,
  pathPrefix?: string
): Promise<UploadResult[]> => {
  const uploadPromises = files.map((file, index) => {
    const path = pathPrefix 
      ? `${pathPrefix}/${Date.now()}-${index}-${file.name}`
      : undefined;
    return uploadFile(file, bucket, path);
  });

  return Promise.all(uploadPromises);
};

/**
 * Delete a file from Supabase Storage
 */
export const deleteFile = async (
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Delete failed' 
    };
  }
};

/**
 * Delete multiple files from Supabase Storage
 */
export const deleteMultipleFiles = async (
  bucket: string,
  paths: string[]
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove(paths);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Delete failed' 
    };
  }
};