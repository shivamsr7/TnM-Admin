import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUploader({
  value,
  onChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    try {
      setUploading(true);

      // TODO:
      // Upload to Supabase Storage
      // const url = await uploadImage(file, folder);

      const url = URL.createObjectURL(file);

      onChange(url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative w-48">
          <img
            src={value}
            alt="Preview"
            className="rounded-lg border"
          />

          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />

          {uploading ? "Uploading..." : "Upload Image"}
        </Button>
      )}

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}