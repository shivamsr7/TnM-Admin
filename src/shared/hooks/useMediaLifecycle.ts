import { useState } from "react";

import { storageService } from "@/shared/services/storage.service";

export function useMediaLifecycle() {
  const [uploadedPaths, setUploadedPaths] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  /**
   * Delete temporary uploads
   * Used when user cancels/discards
   */
  const cleanupUploads = async () => {
    if (saved || uploadedPaths.length === 0) return;

    await Promise.allSettled(
      uploadedPaths.map((path) =>
        storageService.remove(path)
      )
    );
  };

  /**
   * Delete old files after successful update
   */
  const cleanupReplacedFiles = async (
    originalPaths: (string | undefined)[],
    currentPaths: (string | undefined)[]
  ) => {
    const filesToDelete = originalPaths.filter(
      (path, index) =>
        path &&
        path !== currentPaths[index]
    ) as string[];

    if (!filesToDelete.length) return;

    await Promise.allSettled(
      filesToDelete.map((path) =>
        storageService.remove(path)
      )
    );
  };

  /**
   * Reset lifecycle after dialog closes
   */
  const resetLifecycle = () => {
    setUploadedPaths([]);
    setSaved(false);
  };

  return {
    uploadedPaths,
    setUploadedPaths,

    saved,
    setSaved,

    cleanupUploads,
    cleanupReplacedFiles,

    resetLifecycle,
  };
}