import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import {
  ImagePlus,
  Loader2,
  Trash2,
  GripVertical,
} from "lucide-react";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";

import { storageService } from "@/shared/services/storage.service";

export interface ProductImage {
  url: string;
  path?: string;

  isCover: boolean;
  sortOrder: number;

  /**
   * true once this image belongs to
   * a saved database record.
   */
  persisted?: boolean;
}
export interface MediaUploaderHandle {
  /**
   * Called after successful DB save.
   * Prevents uploaded images from being
   * removed during cleanup.
   */
  markAsSaved(): void;

  /**
   * Delete every temporary uploaded image.
   */
  cleanup(): Promise<void>;

  /**
   * Reset uploader state.
   */
  reset(): void;
}
interface MediaUploaderProps {
  folder: string;

  value?: ProductImage[];

  onChange?: (images: ProductImage[]) => void;

  disabled?: boolean;

  maxImages?: number;

  title?: string;

  showCoverLabel?: boolean;

  enableSorting?: boolean;

  /**
   * Automatically remove uploaded files
   * if component unmounts before saving.
   */
  cleanupOnUnmount?: boolean;

  /**
   * Existing images from database.
   * These should never be auto deleted.
   */
  persisted?: boolean;
}
interface SortableImageProps {
  image: ProductImage;
  index: number;
  onRemove: (index: number) => void;
  showCoverLabel?: boolean;
  enableSorting?: boolean;
}
function SortableImage({
  image,
  index,
  onRemove,
  showCoverLabel = true,
  enableSorting = true,
}: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: image.url,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative overflow-hidden rounded-xl border bg-white shadow-sm"
    >
      <img
        src={image.url}
        alt={`Product ${index + 1}`}
        className="aspect-square w-full object-cover"
      />

     {showCoverLabel && image.isCover && (
  <span className="absolute left-2 top-2 rounded bg-black px-2 py-1 text-xs text-white">
    Cover
  </span>
)}

      {enableSorting && (
  <button
    {...attributes}
    {...listeners}
    type="button"
    className="absolute bottom-2 left-2 rounded bg-white p-2 shadow cursor-grab active:cursor-grabbing"
  >
    <GripVertical className="h-4 w-4" />
  </button>
)}

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute right-2 top-2 rounded-full bg-white p-2 shadow opacity-0 transition group-hover:opacity-100 hover:bg-red-500 hover:text-white"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <div className="border-t bg-gray-50 px-3 py-2 text-center text-xs">
        Image {index + 1}
      </div>
    </div>
  );
}
const MediaUploader = forwardRef<
  MediaUploaderHandle,
  MediaUploaderProps
>(function MediaUploader(
  {
    folder,
    value = [],
    onChange,
    disabled = false,
    maxImages = 10,
    title = "Uploaded Images",
    showCoverLabel = true,
    enableSorting = true,
    cleanupOnUnmount = false,
    persisted = false,
  },
  ref
) {
  const [images, setImages] =
    useState<ProductImage[]>(value);

  const [uploading, setUploading] =
    useState(false);
const uploadedPaths = useRef<string[]>([]);

const isSaved = useRef(false);
  useEffect(() => {
    setImages(value);
  }, [value]);


useEffect(() => {
  return () => {
    if (!cleanupOnUnmount) return;

    if (isSaved.current) return;

    const paths = [...uploadedPaths.current];

    uploadedPaths.current = [];

    if (!paths.length) return;

    Promise.allSettled(
      paths.map((path) =>
        storageService.remove(path)
      )
    );
  };
}, [cleanupOnUnmount]);
  const uploadFile = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      if (
        images.length + acceptedFiles.length >
        maxImages
      ) {
        toast.error(
          `Maximum ${maxImages} images allowed.`
        );
        return;
      }

      try {
        setUploading(true);

        const uploadedImages: ProductImage[] = [];
/**
 * Banner mode (maxImages = 1):
 * Replace the previous image instead of keeping both.
 */
if (
  maxImages === 1 &&
  images.length &&
  images[0].path
) {
  try {
    await storageService.remove(images[0].path);

    uploadedPaths.current =
      uploadedPaths.current.filter(
        (p) => p !== images[0].path
      );
  } catch (error) {
    console.error(error);
  }

  setImages([]);
}
        for (const file of acceptedFiles) {
          const result =
            await storageService.upload(
              file,
              folder
            );

const image: ProductImage = {
  url: result.publicUrl,
  path: result.path,
  isCover: false,
  sortOrder: 0,
  persisted,
};

uploadedImages.push(image);

/**
 * Track newly uploaded files.
 * Ignore duplicates.
 */
if (
  cleanupOnUnmount &&
  !persisted &&
  result.path &&
  !uploadedPaths.current.includes(result.path)
) {
  uploadedPaths.current.push(result.path);
}
        }

        const mergedImages = [...images, ...uploadedImages];

const uniqueImages = mergedImages.filter(
  (image, index, self) =>
    index ===
    self.findIndex((i) => i.url === image.url)
);

const updatedImages = uniqueImages.map((image, index) => ({
  ...image,
  isCover: index === 0,
  sortOrder: index,
}));

setImages(updatedImages);
onChange?.(updatedImages);

toast.success(
  `${uploadedImages.length} image(s) uploaded successfully`
);

        toast.success(
          `${uploadedImages.length} image(s) uploaded successfully`
        );
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload image");
      } finally {
        setUploading(false);
      }
    },
    [
      folder,
      images,
      maxImages,
      onChange,
    ]
  );

 async function removeImage(index: number) {
  try {
    const image = images[index];

    if (image?.path) {
      await storageService.remove(image.path);
      uploadedPaths.current =
  uploadedPaths.current.filter(
    (p) => p !== image.path
  );
    }

    const updatedImages = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({
        ...img,
        isCover: i === 0,
        sortOrder: i,
      }));

    setImages(updatedImages);

    onChange?.(updatedImages);

    toast.success("Image removed");
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete image");
  }
}
function handleDragEnd(event: any) {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  const oldIndex = images.findIndex(
    (img) => img.url === active.id
  );

  const newIndex = images.findIndex(
    (img) => img.url === over.id
  );

  const reordered = arrayMove(
    images,
    oldIndex,
    newIndex
  ).map((image, index) => ({
    ...image,
    isCover: index === 0,
    sortOrder: index,
  }));

  setImages(reordered);
  onChange?.(reordered);
}
  const {
    getRootProps,
    
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop: uploadFile,
    multiple: true,
    maxFiles: maxImages,
    disabled: disabled || uploading,
    accept: {
      "image/*": [],
    },
  });
useImperativeHandle(ref, () => ({
  markAsSaved() {
    isSaved.current = true;
    uploadedPaths.current = [];
  },

  async cleanup() {
    if (!uploadedPaths.current.length) return;

    const paths = [...uploadedPaths.current];

    uploadedPaths.current = [];

    await Promise.allSettled(
      paths.map((path) =>
        storageService.remove(path)
      )
    );
  },

  reset() {
    uploadedPaths.current = [];
    isSaved.current = false;

    setImages([]);
  },
}));
  return (
    <div className="space-y-5">
            <div
        {...getRootProps()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition
          ${
            isDragActive
              ? "border-black bg-gray-50"
              : "border-gray-300 hover:border-black"
          }
          ${
            disabled
              ? "cursor-not-allowed opacity-60"
              : ""
          }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center">
          {uploading ? (
            <Loader2 className="mb-3 h-12 w-12 animate-spin" />
          ) : (
            <ImagePlus className="mb-3 h-12 w-12 text-gray-400" />
          )}

          <h3 className="text-lg font-semibold">
            {uploading
              ? "Uploading..."
              : "Upload Images"}
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Drag & drop one or more images here,
            or click to browse
          </p>

          <p className="mt-1 text-xs text-gray-400">
            PNG, JPG, JPEG, WEBP
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
  {title}
</h3>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
          {images.length} / {maxImages}
        </span>
      </div>

      {images.length > 0 && (
  enableSorting ? (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={images.map((i) => i.url)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5">
          {images.map((image, index) => (
            <SortableImage
  key={image.url}
  image={image}
  index={index}
  onRemove={removeImage}
  showCoverLabel={showCoverLabel}
  enableSorting={enableSorting}
/>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  ) : (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5">
      {images.map((image, index) => (
        <div
          key={image.url}
          className="group relative overflow-hidden rounded-xl border bg-white shadow-sm"
        >
          <img
            src={image.url}
            alt={`Image ${index + 1}`}
            className="aspect-square w-full object-cover"
          />

          <button
            type="button"
            onClick={() => removeImage(index)}
            className="absolute right-2 top-2 rounded-full bg-white p-2 shadow opacity-0 transition group-hover:opacity-100 hover:bg-red-500 hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="border-t bg-gray-50 px-3 py-2 text-center text-xs">
            Image {index + 1}
          </div>
        </div>
      ))}
    </div>
  )
)}
    </div>
  );
});
export default MediaUploader;