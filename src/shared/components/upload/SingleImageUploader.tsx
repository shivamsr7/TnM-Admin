import MediaUploader, {
  type ProductImage,
} from "@/shared/components/media/MediaUploader";

interface SingleImageUploaderProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  disabled?: boolean;
  title?: string;
}

export default function SingleImageUploader({
  value,
  onChange,
  folder,
  disabled,
  title = "Image",
}: SingleImageUploaderProps) {
  const images: ProductImage[] = value
    ? [
        {
          url: value,
          isCover: true,
          sortOrder: 0,
          persisted: true,
        },
      ]
    : [];

  return (
    <MediaUploader
      folder={folder}
      value={images}
      maxImages={1}
      enableSorting={false}
      showCoverLabel={false}
      disabled={disabled}
      title={title}
      persisted
      onChange={(images) => {
        onChange(images[0]?.url ?? null);
      }}
    />
  );
}