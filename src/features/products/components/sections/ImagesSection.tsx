import SectionCard from "@/shared/components/admin/SectionCard";
import MediaUploader, {
  type ProductImage,
} from "@/shared/components/media/MediaUploader";

interface Props {
  images: ProductImage[];
  setImages: React.Dispatch<
    React.SetStateAction<ProductImage[]>
  >;
}

export default function ImagesSection({
  images,
  setImages,
}: Props) {
  return (
    <SectionCard
      title="Product Images"
      description="Upload high-quality images. The first image automatically becomes the cover image."
    >
      <div className="space-y-6">
        <MediaUploader
          folder="products"
          value={images}
          onChange={setImages}
          maxImages={10}
        />

        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              Uploaded Images
            </span>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {images.length} / 10
            </span>
          </div>

          <div className="mt-3 space-y-1 text-sm text-muted-foreground">
            <p>• First image becomes the cover image.</p>
            <p>• Drag & drop multiple images.</p>
            <p>• JPG, PNG, JPEG & WEBP supported.</p>
            <p>• Maximum 10 images.</p>
            <p>• Recommended size: 1200 × 1500 px.</p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}