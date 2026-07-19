import { supabase } from "@/lib/supabase";

const BUCKET = "media";

export const storageService = {
async upload(file: File, folder = "") {
  console.log("UPLOAD FILE:", file);

  if (!(file instanceof File)) {
    throw new Error("Invalid file passed to storageService.upload()");
  }

  const extension = file.name.split(".").pop();

  const fileName =
    `${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const path = folder
    ? `${folder}/${fileName}`
    : fileName;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return {
    path,
    publicUrl: data.publicUrl,
  };
},

  async remove(path: string) {
    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([path]);

    if (error) throw error;
  },
};