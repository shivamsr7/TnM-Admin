import { useState } from "react";
import { Form } from "@/components/ui/form";

import SettingSection from "../components/SettingSection";

import StoreInformationCard from "../cards/StoreInformationCard";
import RegionalSettingsCard from "../cards/RegionalSettingsCard";

import { useSettingsContext } from "../context/SettingsContext";

import { supabase } from "@/lib/supabase";

interface StorageFile {
  path: string;
  folder: string;
  name: string;
  size?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface StorageInventory {
  totalFiles: number;
  files: StorageFile[];
}

interface CleanupResult {
  attempted: number;
  deletedCount: number;
  failedCount: number;
  message?: string;
  safetyCheckPassed?: boolean;
  deleted?: boolean;
}

interface BannerMigrationResult {
  processed: number;
  migrated: number;
  failed: number;
  skipped: number;
  alreadyMigrated: number;
}

interface CleanupDiagnostic {
  reason?: string;
  message?: string;

  safetyCheckPassed?: boolean;

  supabaseFiles?: number;
  databaseProductImages?: number;

  supabaseReferencedImages?: number;
  nonImageKitImages?: number;
  legacyStoragePaths?: number;

  difference?: number;

  uniqueImageKitPaths?: number;
  duplicateImageKitPaths?: number;

  filesReadyForDeletion?: number;

  affectedImages?: Array<{
    id?: string;
    imageUrl?: string | null;
    storagePath?: string | null;
  }>;

  dryRun?: boolean;

  attempted?: number;
  deleted?: number;
  deletedCount?: number;
  failed?: number;
  failedCount?: number;

  files?: string[];

  failures?: unknown[];

  error?: string;
}

export default function GeneralSection() {
  const {
    form,
    settingsQuery,
    updateMutation,
  } = useSettingsContext();

  const [migrationLoading, setMigrationLoading] =
    useState(false);

  const [migrationResult, setMigrationResult] =
    useState<{
      processed: number;
      migrated: number;
      failed: number;
    } | null>(null);

  const [migrationError, setMigrationError] =
    useState<string | null>(null);

  const [bannerMigrationLoading, setBannerMigrationLoading] =
    useState(false);

  const [bannerMigrationResult, setBannerMigrationResult] =
    useState<BannerMigrationResult | null>(null);

  const [bannerMigrationError, setBannerMigrationError] =
    useState<string | null>(null);

  const [bannerCleanupLoading, setBannerCleanupLoading] =
    useState(false);

  const [bannerCleanupResult, setBannerCleanupResult] =
    useState<{
      attemptedDeletion: number;
      deleted: number;
      remainingExpected: number;
    } | null>(null);

  const [bannerCleanupError, setBannerCleanupError] =
    useState<string | null>(null);

  const [categoryMigrationLoading, setCategoryMigrationLoading] =
    useState(false);

  const [categoryMigrationResult, setCategoryMigrationResult] =
    useState<{
      processed: {
        categories: number;
        subcategories: number;
        total: number;
      };
      migrated: number;
      failed: number;
      skipped: number;
      alreadyMigrated: number;
    } | null>(null);

  const [categoryMigrationError, setCategoryMigrationError] =
    useState<string | null>(null);

  const [storageInventory, setStorageInventory] =
    useState<StorageInventory | null>(null);

  const [cleanupResult, setCleanupResult] =
    useState<CleanupResult | null>(null);

  const [cleanupDiagnostic, setCleanupDiagnostic] =
    useState<CleanupDiagnostic | null>(null);

  // --------------------------------------------------
  // Extract actual Edge Function error response
  // --------------------------------------------------

  const extractFunctionError = async (
    error: any
  ): Promise<CleanupDiagnostic> => {
    const diagnostic: CleanupDiagnostic = {};

    try {
      const context = error?.context;

      if (context) {
        diagnostic.error =
          error?.message ||
          "Edge Function returned an error.";

        try {
          const response =
            typeof context.clone === "function"
              ? context.clone()
              : context;

          if (
            typeof response.json ===
            "function"
          ) {
            const body =
              await response.json();

            if (
              body &&
              typeof body ===
                "object"
            ) {
              Object.assign(
                diagnostic,
                body
              );
            }
          }
        } catch (jsonError) {
          console.error(
            "Unable to parse Edge Function error JSON:",
            jsonError
          );

          try {
            const response =
              typeof context.clone ===
              "function"
                ? context.clone()
                : context;

            if (
              typeof response.text ===
              "function"
            ) {
              const text =
                await response.text();

              if (text) {
                diagnostic.message =
                  text;
              }
            }
          } catch (textError) {
            console.error(
              "Unable to read Edge Function error text:",
              textError
            );
          }
        }
      }
    } catch (parseError) {
      console.error(
        "Failed to extract Edge Function error:",
        parseError
      );
    }

    if (!diagnostic.message) {
      diagnostic.message =
        error?.message ||
        "Something went wrong while communicating with the Edge Function.";
    }

    return diagnostic;
  };

  // --------------------------------------------------
  // Human-readable diagnostic message
  // --------------------------------------------------

  const buildDiagnosticMessage = (
    diagnostic: CleanupDiagnostic
  ) => {
    const parts: string[] = [];

    if (diagnostic.message) {
      parts.push(
        diagnostic.message
      );
    }

    if (
      diagnostic.supabaseFiles !==
        undefined &&
      diagnostic.databaseProductImages !==
        undefined
    ) {
      parts.push(
        `Supabase files: ${diagnostic.supabaseFiles}. Database product images: ${diagnostic.databaseProductImages}.`
      );
    }

    if (
      diagnostic.supabaseReferencedImages !==
      undefined
    ) {
      parts.push(
        `Still referencing Supabase: ${diagnostic.supabaseReferencedImages}.`
      );
    }

    if (
      diagnostic.nonImageKitImages !==
      undefined
    ) {
      parts.push(
        `Not using ImageKit: ${diagnostic.nonImageKitImages}.`
      );
    }

    if (
      diagnostic.legacyStoragePaths !==
      undefined
    ) {
      parts.push(
        `Legacy storage paths: ${diagnostic.legacyStoragePaths}.`
      );
    }

    if (
      diagnostic.uniqueImageKitPaths !==
      undefined
    ) {
      parts.push(
        `Unique ImageKit paths: ${diagnostic.uniqueImageKitPaths}.`
      );
    }

    if (
      diagnostic.duplicateImageKitPaths !==
      undefined
    ) {
      parts.push(
        `Duplicate ImageKit paths: ${diagnostic.duplicateImageKitPaths}.`
      );
    }

    if (
      diagnostic.filesReadyForDeletion !==
      undefined
    ) {
      parts.push(
        `Files ready for deletion: ${diagnostic.filesReadyForDeletion}.`
      );
    }

    if (
      diagnostic.attempted !==
      undefined
    ) {
      parts.push(
        `Attempted: ${diagnostic.attempted}.`
      );
    }

    if (
      diagnostic.deletedCount !==
      undefined
    ) {
      parts.push(
        `Deleted: ${diagnostic.deletedCount}.`
      );
    }

    if (
      diagnostic.failedCount !==
      undefined
    ) {
      parts.push(
        `Failed: ${diagnostic.failedCount}.`
      );
    }

    return parts.join(" ");
  };

  // --------------------------------------------------
  // Migrate existing product images
  // --------------------------------------------------

  const runMigration = async (
    limit: number
  ) => {
    if (migrationLoading) return;

    setMigrationLoading(true);
    setMigrationResult(null);
    setMigrationError(null);
    setCleanupResult(null);
    setCleanupDiagnostic(null);

    try {
      const {
        data,
        error,
      } = await supabase.functions.invoke(
        "migrate-product-images",
        {
          body: {
            limit,
          },
        }
      );

      if (error) {
        throw error;
      }

      if (!data?.success) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Image migration failed."
        );
      }

      setMigrationResult({
        processed:
          data.processed ?? 0,
        migrated:
          data.migrated ?? 0,
        failed:
          data.failed ?? 0,
      });
    } catch (error) {
      console.error(
        "Product image migration error:",
        error
      );

      setMigrationError(
        error instanceof Error
          ? error.message
          : "Something went wrong while migrating images."
      );
    } finally {
      setMigrationLoading(false);
    }
  };

  // --------------------------------------------------
  // Migrate existing banner images
  // --------------------------------------------------

  const runBannerMigration = async (
    limit: number
  ) => {
    if (bannerMigrationLoading) return;

    setBannerMigrationLoading(true);
    setBannerMigrationResult(null);
    setBannerMigrationError(null);

    try {
      const {
        data,
        error,
      } = await supabase.functions.invoke(
        "migrate-banners",
        {
          body: {
            limit,
          },
        }
      );

      if (error) {
        console.error(
          "Banner migration function error:",
          error
        );

        throw error;
      }

      if (!data) {
        throw new Error(
          "No response was returned from the banner migration function."
        );
      }

      console.log(
        "Banner migration response:",
        data
      );

      if (!data.success) {
        throw new Error(
          data.message ||
            data.error ||
            "Banner migration failed."
        );
      }

      setBannerMigrationResult({
        processed:
          data.processed ?? 0,

        migrated:
          data.migrated ?? 0,

        failed:
          data.failed ?? 0,

        skipped:
          data.skipped ?? 0,

        alreadyMigrated:
          data.alreadyMigrated ?? 0,
      });
    } catch (error) {
      console.error(
        "Banner migration error:",
        error
      );

      setBannerMigrationError(
        error instanceof Error
          ? error.message
          : "Something went wrong while migrating banners."
      );
    } finally {
      setBannerMigrationLoading(false);
    }
  };

  // --------------------------------------------------
  // Delete old Supabase banner images
  // --------------------------------------------------

  const deleteOldBannerImages = async () => {
    if (
      bannerCleanupLoading ||
      bannerMigrationLoading ||
      migrationLoading
    ) {
      return;
    }

    setBannerCleanupLoading(true);
    setBannerCleanupResult(null);
    setBannerCleanupError(null);

    try {
      // First run the cleanup function in dry-run mode.
      // The Edge Function performs all safety checks before
      // returning the number of files that are safe to delete.
      const {
        data: inspectionData,
        error: inspectionError,
      } = await supabase.functions.invoke(
        "cleanup-banners",
        {
          body: {
            confirm: false,
          },
        }
      );

      if (inspectionError) {
        throw inspectionError;
      }

      if (!inspectionData) {
        throw new Error(
          "No response was returned from the banner cleanup function."
        );
      }

      console.log(
        "Banner cleanup inspection response:",
        inspectionData
      );

      if (!inspectionData.success) {
        throw new Error(
          inspectionData.message ||
            inspectionData.error ||
            "Banner cleanup safety check failed."
        );
      }

      const readyForDeletion =
        inspectionData.readyForDeletion ?? 0;

      if (readyForDeletion === 0) {
        setBannerCleanupResult({
          attemptedDeletion: 0,
          deleted: 0,
          remainingExpected: 0,
        });

        return;
      }

      const confirmed = window.confirm(
        `This will permanently delete ${readyForDeletion} old banner file${
          readyForDeletion === 1 ? "" : "s"
        } from Supabase Storage.\n\nYour migrated ImageKit banner images will NOT be deleted.\n\nYour banner database records will NOT be deleted.\n\nOnly files inside banners/desktop and banners/mobile will be deleted.\n\nThe cleanup function has verified that current banner images use ImageKit.\n\nAre you sure you want to continue?`
      );

      if (!confirmed) {
        return;
      }

      const {
        data: deleteData,
        error: deleteError,
      } = await supabase.functions.invoke(
        "cleanup-banners",
        {
          body: {
            confirm: true,
          },
        }
      );

      if (deleteError) {
        throw deleteError;
      }

      if (!deleteData) {
        throw new Error(
          "No response was returned from the banner deletion function."
        );
      }

      console.log(
        "Banner cleanup deletion response:",
        deleteData
      );

      if (!deleteData.success) {
        throw new Error(
          deleteData.message ||
            deleteData.error ||
            "Some banner files could not be deleted."
        );
      }

      setBannerCleanupResult({
        attemptedDeletion:
          deleteData.attemptedDeletion ??
          readyForDeletion,
        deleted:
          deleteData.deleted ?? 0,
        remainingExpected:
          deleteData.remainingExpected ?? 0,
      });
    } catch (error) {
      console.error(
        "Banner cleanup error:",
        error
      );

      setBannerCleanupError(
        error instanceof Error
          ? error.message
          : "Something went wrong while deleting old banner files."
      );
    } finally {
      setBannerCleanupLoading(false);
    }
  };

  // --------------------------------------------------
  // Migrate existing category + subcategory images
  // --------------------------------------------------

  const runCategoryMigration = async (
    limit: number
  ) => {
    if (
      categoryMigrationLoading ||
      migrationLoading ||
      bannerMigrationLoading ||
      bannerCleanupLoading
    ) {
      return;
    }

    setCategoryMigrationLoading(true);
    setCategoryMigrationResult(null);
    setCategoryMigrationError(null);

    try {
      const {
        data,
        error,
      } = await supabase.functions.invoke(
        "migrate-categories-subcategories",
        {
          body: {
            limit,
          },
        }
      );

      if (error) {
        console.error(
          "Category/subcategory migration function error:",
          error
        );

        throw error;
      }

      if (!data) {
        throw new Error(
          "No response was returned from the category/subcategory migration function."
        );
      }

      console.log(
        "Category/subcategory migration response:",
        data
      );

      if (!data.success) {
        throw new Error(
          data.message ||
            data.error ||
            "Category/subcategory migration failed."
        );
      }

      setCategoryMigrationResult({
        processed: {
          categories:
            data.processed?.categories ?? 0,
          subcategories:
            data.processed?.subcategories ?? 0,
          total:
            data.processed?.total ?? 0,
        },
        migrated:
          data.migrated ?? 0,
        failed:
          data.failed ?? 0,
        skipped:
          data.skipped ?? 0,
        alreadyMigrated:
          data.alreadyMigrated ?? 0,
      });
    } catch (error) {
      console.error(
        "Category/subcategory migration error:",
        error
      );

      setCategoryMigrationError(
        error instanceof Error
          ? error.message
          : "Something went wrong while migrating category and subcategory images."
      );
    } finally {
      setCategoryMigrationLoading(false);
    }
  };

  // --------------------------------------------------
  // Convert inventory response
  // --------------------------------------------------

  const convertInventoryFiles = (
    data: any
  ): StorageFile[] => {
    if (
      !Array.isArray(
        data?.files
      )
    ) {
      return [];
    }

    return data.files.map(
      (item: any) => {
        if (
          typeof item ===
            "object" &&
          item !== null
        ) {
          return {
            path:
              item.path ??
              item.name ??
              "",
            folder:
              item.folder ??
              "products",
            name:
              item.name ??
              item.path ??
              "",
            size:
              item.size,
            createdAt:
              item.createdAt,
            updatedAt:
              item.updatedAt,
          };
        }

        const path =
          String(item);

        const parts =
          path.split("/");

        const name =
          parts[
            parts.length - 1
          ] || path;

        return {
          path,
          folder: "products",
          name,
        };
      }
    );
  };

  // --------------------------------------------------
  // Inspect Supabase Storage
  // --------------------------------------------------

  const inspectStorage = async () => {
    if (migrationLoading) return;

    setMigrationLoading(true);
    setMigrationError(null);
    setCleanupResult(null);
    setCleanupDiagnostic(null);

    try {
      const {
        data,
        error,
      } = await supabase.functions.invoke(
        "cleanup-product-images",
        {
          body: {},
        }
      );

      if (error) {
        const diagnostic =
          await extractFunctionError(
            error
          );

        console.error(
          "Storage inspection function error:",
          diagnostic
        );

        setCleanupDiagnostic(
          diagnostic
        );

        setMigrationError(
          buildDiagnosticMessage(
            diagnostic
          )
        );

        return;
      }

      if (!data) {
        throw new Error(
          "No response was returned from the cleanup function."
        );
      }

      console.log(
        "Storage inspection response:",
        data
      );

      const diagnostic: CleanupDiagnostic =
        {
          reason:
            data.reason,

          message:
            data.message,

          safetyCheckPassed:
            data.safetyCheckPassed,

          supabaseFiles:
            data.supabaseFiles,

          databaseProductImages:
            data.databaseProductImages,

          supabaseReferencedImages:
            data.supabaseReferencedImages,

          nonImageKitImages:
            data.nonImageKitImages,

          legacyStoragePaths:
            data.legacyStoragePaths,

          difference:
            data.difference,

          uniqueImageKitPaths:
            data.uniqueImageKitPaths,

          duplicateImageKitPaths:
            data.duplicateImageKitPaths,

          filesReadyForDeletion:
            data.filesReadyForDeletion,

          affectedImages:
            data.affectedImages,

          dryRun:
            data.dryRun,

          files:
            data.files,
        };

      setCleanupDiagnostic(
        diagnostic
      );

      const files =
        convertInventoryFiles(
          data
        );

      setStorageInventory({
        totalFiles:
          data.totalFiles ??
          data.supabaseFiles ??
          files.length,
        files,
      });

      /*
       * A failed safety check is a diagnostic
       * result, not an application crash.
       */

      if (
        data.safetyCheckPassed ===
        false
      ) {
        setMigrationError(
          buildDiagnosticMessage(
            diagnostic
          )
        );

        return;
      }

      setMigrationError(null);
    } catch (error) {
      console.error(
        "Storage inventory error:",
        error
      );

      setMigrationError(
        error instanceof Error
          ? error.message
          : "Unable to inspect Supabase Storage."
      );
    } finally {
      setMigrationLoading(false);
    }
  };

  // --------------------------------------------------
  // Delete old Supabase product images
  // --------------------------------------------------

  const deleteOldProductImages =
    async () => {
      if (migrationLoading) return;

      const totalFiles =
        storageInventory?.totalFiles ??
        0;

      if (totalFiles === 0) {
        setMigrationError(
          "No old product images were found in Supabase Storage."
        );

        return;
      }

      const confirmed =
        window.confirm(
          `This will permanently delete ${totalFiles} old product image${
            totalFiles === 1
              ? ""
              : "s"
          } from Supabase Storage.

Your migrated ImageKit images will NOT be deleted.

Your product database records will NOT be deleted.

Only files inside the Supabase "products/" folder will be deleted.

The Edge Function will first verify that all current product images are using ImageKit.

Are you sure you want to continue?`
        );

      if (!confirmed) {
        return;
      }

      setMigrationLoading(true);
      setMigrationError(null);
      setCleanupResult(null);
      setCleanupDiagnostic(null);

      try {
        const {
          data,
          error,
        } = await supabase.functions.invoke(
          "cleanup-product-images",
          {
            body: {
              confirmDelete: true,
            },
          }
        );

        if (error) {
          const diagnostic =
            await extractFunctionError(
              error
            );

          console.error(
            "Product image cleanup function error:",
            diagnostic
          );

          setCleanupDiagnostic(
            diagnostic
          );

          setMigrationError(
            buildDiagnosticMessage(
              diagnostic
            )
          );

          return;
        }

        if (!data) {
          throw new Error(
            "No response was returned from the cleanup function."
          );
        }

        console.log(
          "Product image cleanup response:",
          data
        );

        const diagnostic: CleanupDiagnostic =
          {
            reason:
              data.reason,

            message:
              data.message,

            safetyCheckPassed:
              data.safetyCheckPassed,

            supabaseFiles:
              data.supabaseFiles,

            databaseProductImages:
              data.databaseProductImages,

            supabaseReferencedImages:
              data.supabaseReferencedImages,

            nonImageKitImages:
              data.nonImageKitImages,

            legacyStoragePaths:
              data.legacyStoragePaths,

            difference:
              data.difference,

            uniqueImageKitPaths:
              data.uniqueImageKitPaths,

            duplicateImageKitPaths:
              data.duplicateImageKitPaths,

            filesReadyForDeletion:
              data.filesReadyForDeletion,

            affectedImages:
              data.affectedImages,

            dryRun:
              data.dryRun,

            attempted:
              data.attempted,

            deleted:
              data.deleted,

            deletedCount:
              data.deletedCount,

            failed:
              data.failed,

            failedCount:
              data.failedCount,

            files:
              data.files,

            failures:
              data.failures,

            error:
              data.error,
          };

        setCleanupDiagnostic(
          diagnostic
        );

        // ----------------------------------------------
        // SAFETY CHECK FAILED
        // ----------------------------------------------

        if (
          data.safetyCheckPassed ===
          false
        ) {
          setMigrationError(
            buildDiagnosticMessage(
              diagnostic
            )
          );

          /*
           * Absolutely do not modify inventory
           * as if deletion occurred.
           */

          return;
        }

        // ----------------------------------------------
        // SUCCESSFUL DELETION
        // ----------------------------------------------

        setCleanupResult({
          attempted:
            data.attempted ?? 0,

          deletedCount:
            data.deletedCount ??
            data.deleted ??
            0,

          failedCount:
            data.failedCount ??
            data.failed ??
            0,

          message:
            data.message,

          safetyCheckPassed:
            data.safetyCheckPassed,

          deleted:
            data.deleted,
        });

        setMigrationError(null);

        // ----------------------------------------------
        // REFRESH INVENTORY
        // ----------------------------------------------

        const {
          data: inventoryData,
          error:
            inventoryError,
        } =
          await supabase.functions.invoke(
            "cleanup-product-images",
            {
              body: {},
            }
          );

        if (
          inventoryError
        ) {
          console.warn(
            "Inventory refresh failed after deletion:",
            inventoryError
          );

          return;
        }

        if (inventoryData) {
          const remainingFiles =
            convertInventoryFiles(
              inventoryData
            );

          setStorageInventory({
            totalFiles:
              inventoryData.totalFiles ??
              inventoryData.supabaseFiles ??
              remainingFiles.length,

            files:
              remainingFiles,
          });
        }
      } catch (error: any) {
        console.error(
          "Product image cleanup error:",
          error
        );

        const diagnostic =
          await extractFunctionError(
            error
          );

        console.error(
          "Cleanup diagnostic:",
          diagnostic
        );

        setCleanupDiagnostic(
          diagnostic
        );

        setMigrationError(
          buildDiagnosticMessage(
            diagnostic
          )
        );
      } finally {
        setMigrationLoading(false);
      }
    };

  // --------------------------------------------------
  // Format file size
  // --------------------------------------------------

  const formatFileSize = (
    size?: number
  ) => {
    if (
      size === undefined ||
      size === null
    ) {
      return "—";
    }

    if (size < 1024) {
      return `${size} B`;
    }

    if (
      size <
      1024 * 1024
    ) {
      return `${(
        size / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      size /
      (1024 * 1024)
    ).toFixed(2)} MB`;
  };

  // --------------------------------------------------
  // Folder counts
  // --------------------------------------------------

  const getFolderCounts =
    () => {
      if (!storageInventory) {
        return {};
      }

      return storageInventory.files.reduce<
        Record<string, number>
      >(
        (
          counts,
          file
        ) => {
          const folder =
            file.folder ||
            "/";

          counts[folder] =
            (counts[folder] ??
              0) + 1;

          return counts;
        },
        {}
      );
    };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (
    settingsQuery.isPending
  ) {
    return (
      <div className="rounded-2xl border bg-white p-8">
        Loading...
      </div>
    );
  }

  const folderCounts =
    getFolderCounts();

  const productFileCount =
    storageInventory?.totalFiles ??
    0;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (values) => {
            updateMutation.mutate(
              values
            );
          }
        )}
      >
        <SettingSection
          title="General Settings"
          description="Manage your store information and regional preferences."
        >
          <StoreInformationCard
            form={form}
          />

          <RegionalSettingsCard
            form={form}
          />

          {/* ----------------------------------------- */}
          {/* IMAGE STORAGE MIGRATION                   */}
          {/* ----------------------------------------- */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-gray-900">
                Image Storage Migration
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Manage existing product images
                and migrate them from Supabase
                Storage to ImageKit.
              </p>
            </div>

            <div className="rounded-xl border bg-gray-50 p-4">
              <p className="text-sm text-gray-700">
                Existing product images can
                be copied to ImageKit and
                their database records
                updated.
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Original Supabase images are
                kept until you explicitly
                remove them.
              </p>
            </div>

            {/* --------------------------------------- */}
            {/* BUTTONS                                 */}
            {/* --------------------------------------- */}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={
                  migrationLoading
                }
                onClick={() =>
                  runMigration(1)
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {migrationLoading
                  ? "Processing..."
                  : "Migrate 1 Image"}
              </button>

              <button
                type="button"
                disabled={
                  migrationLoading
                }
                onClick={() =>
                  runMigration(10)
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-lg
                  bg-black
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-gray-800
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {migrationLoading
                  ? "Processing..."
                  : "Migrate 10 Images"}
              </button>

              <button
                type="button"
                disabled={
                  migrationLoading
                }
                onClick={
                  inspectStorage
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {migrationLoading
                  ? "Checking..."
                  : "Inspect Supabase Storage"}
              </button>
            </div>

            {/* --------------------------------------- */}
            {/* LOADING                                 */}
            {/* --------------------------------------- */}

            {migrationLoading && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <span
                  className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-gray-300
                    border-t-gray-900
                  "
                />

                Processing...
              </div>
            )}

            {/* --------------------------------------- */}
            {/* MIGRATION RESULT                        */}
            {/* --------------------------------------- */}

            {migrationResult && (
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-medium text-green-800">
                  Migration completed
                </p>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-green-700">
                      Processed
                    </p>

                    <p className="text-lg font-semibold text-green-900">
                      {
                        migrationResult.processed
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-green-700">
                      Migrated
                    </p>

                    <p className="text-lg font-semibold text-green-900">
                      {
                        migrationResult.migrated
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-green-700">
                      Failed
                    </p>

                    <p className="text-lg font-semibold text-green-900">
                      {
                        migrationResult.failed
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------- */}
            {/* CATEGORY + SUBCATEGORY MIGRATION        */}
            {/* --------------------------------------- */}

            <div className="mt-6 border-t pt-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  Category & Subcategory Image Migration
                </h4>

                <p className="mt-1 text-xs text-gray-500">
                  Migrate existing category and subcategory
                  images from Supabase Storage to ImageKit.
                </p>
              </div>

              <div className="mt-4 rounded-xl border bg-gray-50 p-4">
                <p className="text-sm text-gray-700">
                  Existing images will be copied to ImageKit
                  and the corresponding database records will
                  be updated with the ImageKit URL and file path.
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  Original Supabase files are kept untouched
                  until migration and storefront verification
                  are complete.
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={
                    categoryMigrationLoading ||
                    migrationLoading ||
                    bannerMigrationLoading ||
                    bannerCleanupLoading
                  }
                  onClick={() =>
                    runCategoryMigration(1)
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-gray-700
                    transition
                    hover:bg-gray-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {categoryMigrationLoading
                    ? "Processing..."
                    : "Migrate 1 + 1"}
                </button>

                <button
                  type="button"
                  disabled={
                    categoryMigrationLoading ||
                    migrationLoading ||
                    bannerMigrationLoading ||
                    bannerCleanupLoading
                  }
                  onClick={() =>
                    runCategoryMigration(10)
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-lg
                    bg-black
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-gray-800
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {categoryMigrationLoading
                    ? "Processing..."
                    : "Migrate 10 + 10"}
                </button>
              </div>

              {categoryMigrationLoading && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-gray-300
                      border-t-gray-900
                    "
                  />

                  Migrating category and subcategory images...
                </div>
              )}

              {categoryMigrationResult && (
                <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-800">
                    Category & subcategory migration completed
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
                    <div>
                      <p className="text-xs text-green-700">
                        Categories
                      </p>
                      <p className="text-lg font-semibold text-green-900">
                        {categoryMigrationResult.processed.categories}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-green-700">
                        Subcategories
                      </p>
                      <p className="text-lg font-semibold text-green-900">
                        {categoryMigrationResult.processed.subcategories}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-green-700">
                        Migrated
                      </p>
                      <p className="text-lg font-semibold text-green-900">
                        {categoryMigrationResult.migrated}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-green-700">
                        Failed
                      </p>
                      <p className="text-lg font-semibold text-green-900">
                        {categoryMigrationResult.failed}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-green-700">
                        Already ImageKit
                      </p>
                      <p className="text-lg font-semibold text-green-900">
                        {categoryMigrationResult.alreadyMigrated}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-green-700">
                    Skipped: {categoryMigrationResult.skipped}
                    {" · "}
                    Total processed: {categoryMigrationResult.processed.total}
                  </div>
                </div>
              )}

              {categoryMigrationError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800">
                    Category/subcategory migration failed
                  </p>

                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-red-700">
                    {categoryMigrationError}
                  </p>
                </div>
              )}
            </div>

            {/* --------------------------------------- */}
            {/* BANNER IMAGE MIGRATION                  */}
            {/* --------------------------------------- */}

            <div className="mt-6 border-t pt-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  Banner Image Migration
                </h4>

                <p className="mt-1 text-xs text-gray-500">
                  Migrate desktop and mobile banner
                  images from Supabase Storage to
                  ImageKit.
                </p>
              </div>

              <div className="mt-4 rounded-xl border bg-gray-50 p-4">
                <p className="text-sm text-gray-700">
                  Banner migration updates the
                  existing banner database records
                  with the new ImageKit URLs and
                  storage paths.
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  Original Supabase banner files are
                  kept untouched until we verify the
                  migration.
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={
                    bannerMigrationLoading ||
                    migrationLoading
                  }
                  onClick={() =>
                    runBannerMigration(1)
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-gray-700
                    transition
                    hover:bg-gray-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {bannerMigrationLoading
                    ? "Processing..."
                    : "Migrate 1 Banner"}
                </button>

                <button
                  type="button"
                  disabled={
                    bannerMigrationLoading ||
                    migrationLoading
                  }
                  onClick={() =>
                    runBannerMigration(10)
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-lg
                    bg-black
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-gray-800
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {bannerMigrationLoading
                    ? "Processing..."
                    : "Migrate 10 Banners"}
                </button>
              </div>

              {bannerMigrationLoading && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-gray-300
                      border-t-gray-900
                    "
                  />

                  Migrating banners...
                </div>
              )}

              {bannerMigrationResult && (
                <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-800">
                    Banner migration completed
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
                    <div>
                      <p className="text-xs text-green-700">
                        Processed
                      </p>

                      <p className="text-lg font-semibold text-green-900">
                        {
                          bannerMigrationResult.processed
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-green-700">
                        Migrated
                      </p>

                      <p className="text-lg font-semibold text-green-900">
                        {
                          bannerMigrationResult.migrated
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-green-700">
                        Failed
                      </p>

                      <p className="text-lg font-semibold text-green-900">
                        {
                          bannerMigrationResult.failed
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-green-700">
                        Skipped
                      </p>

                      <p className="text-lg font-semibold text-green-900">
                        {
                          bannerMigrationResult.skipped
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-green-700">
                        Already ImageKit
                      </p>

                      <p className="text-lg font-semibold text-green-900">
                        {
                          bannerMigrationResult.alreadyMigrated
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {bannerMigrationError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800">
                    Banner migration failed
                  </p>

                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-red-700">
                    {bannerMigrationError}
                  </p>
                </div>
              )}
            </div>

            {/* --------------------------------------- */}
            {/* BANNER CLEANUP                          */}
            {/* --------------------------------------- */}

            <div className="mt-6 border-t pt-6">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-800">
                  Remove Old Supabase Banner Files
                </p>

                <p className="mt-1 text-sm text-red-700">
                  Permanently remove the old desktop and mobile banner files from Supabase Storage after migration to ImageKit.
                </p>

                <p className="mt-2 text-xs text-red-600">
                  A safety check runs first. Nothing is deleted if any current banner still references Supabase or fails the ImageKit path checks.
                </p>

                <button
                  type="button"
                  disabled={
                    bannerCleanupLoading ||
                    bannerMigrationLoading ||
                    migrationLoading
                  }
                  onClick={
                    deleteOldBannerImages
                  }
                  className="
                    mt-4
                    inline-flex
                    items-center
                    justify-center
                    rounded-lg
                    bg-red-600
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-red-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {bannerCleanupLoading
                    ? "Checking..."
                    : "Delete Old Banner Files"}
                </button>
              </div>

              {bannerCleanupLoading && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-gray-300
                      border-t-gray-900
                    "
                  />

                  Verifying banner migration and storage safety...
                </div>
              )}

              {bannerCleanupResult && (
                <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-800">
                    Banner storage cleanup completed
                  </p>

                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-green-700">
                        Attempted
                      </p>
                      <p className="text-lg font-semibold text-green-900">
                        {bannerCleanupResult.attemptedDeletion}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-green-700">
                        Deleted
                      </p>
                      <p className="text-lg font-semibold text-green-900">
                        {bannerCleanupResult.deleted}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-green-700">
                        Remaining
                      </p>
                      <p className="text-lg font-semibold text-green-900">
                        {bannerCleanupResult.remainingExpected}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {bannerCleanupError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800">
                    Banner cleanup failed
                  </p>

                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-red-700">
                    {bannerCleanupError}
                  </p>
                </div>
              )}
            </div>

            {/* --------------------------------------- */}
            {/* CLEANUP RESULT                          */}
            {/* --------------------------------------- */}

            {cleanupResult && (
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-medium text-green-800">
                  Supabase product image cleanup
                  completed
                </p>

                {cleanupResult.message && (
                  <p className="mt-1 text-sm text-green-700">
                    {
                      cleanupResult.message
                    }
                  </p>
                )}

                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-green-700">
                      Attempted
                    </p>

                    <p className="text-lg font-semibold text-green-900">
                      {
                        cleanupResult.attempted
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-green-700">
                      Deleted
                    </p>

                    <p className="text-lg font-semibold text-green-900">
                      {
                        cleanupResult.deletedCount
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-green-700">
                      Failed
                    </p>

                    <p className="text-lg font-semibold text-green-900">
                      {
                        cleanupResult.failedCount
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------- */}
            {/* DIAGNOSTIC                              */}
            {/* --------------------------------------- */}

            {cleanupDiagnostic && (
              <div
                className={`
                  mt-5
                  rounded-xl
                  border
                  p-5
                  ${
                    cleanupDiagnostic.safetyCheckPassed ===
                    true
                      ? "border-green-200 bg-green-50"
                      : "border-amber-200 bg-amber-50"
                  }
                `}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className={`
                        text-sm font-semibold
                        ${
                          cleanupDiagnostic.safetyCheckPassed ===
                          true
                            ? "text-green-800"
                            : "text-amber-800"
                        }
                      `}
                    >
                      Cleanup Diagnostic
                    </p>

                    {cleanupDiagnostic.reason && (
                      <p className="mt-1 text-xs font-mono text-gray-600">
                        Reason:{" "}
                        {
                          cleanupDiagnostic.reason
                        }
                      </p>
                    )}
                  </div>

                  <span
                    className={`
                      rounded-full
                      px-2.5
                      py-1
                      text-xs
                      font-medium
                      ${
                        cleanupDiagnostic.safetyCheckPassed ===
                        true
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }
                    `}
                  >
                    {cleanupDiagnostic.safetyCheckPassed ===
                    true
                      ? "Safety Passed"
                      : "Safety Blocked"}
                  </span>
                </div>

                {cleanupDiagnostic.message && (
                  <div className="mt-4 rounded-lg border bg-white p-3">
                    <p className="text-xs font-medium text-gray-500">
                      Function message
                    </p>

                    <p className="mt-1 text-sm text-gray-800">
                      {
                        cleanupDiagnostic.message
                      }
                    </p>
                  </div>
                )}

                {/* ----------------------------------- */}
                {/* MAIN COUNTS                          */}
                {/* ----------------------------------- */}

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg border bg-white p-3">
                    <p className="text-xs text-gray-500">
                      Supabase Files
                    </p>

                    <p className="mt-1 text-xl font-semibold text-gray-900">
                      {cleanupDiagnostic.supabaseFiles ??
                        "—"}
                    </p>
                  </div>

                  <div className="rounded-lg border bg-white p-3">
                    <p className="text-xs text-gray-500">
                      DB Product Images
                    </p>

                    <p className="mt-1 text-xl font-semibold text-gray-900">
                      {cleanupDiagnostic.databaseProductImages ??
                        "—"}
                    </p>
                  </div>

                  <div className="rounded-lg border bg-white p-3">
                    <p className="text-xs text-gray-500">
                      Supabase References
                    </p>

                    <p className="mt-1 text-xl font-semibold text-gray-900">
                      {cleanupDiagnostic.supabaseReferencedImages ??
                        "—"}
                    </p>
                  </div>

                  <div className="rounded-lg border bg-white p-3">
                    <p className="text-xs text-gray-500">
                      Ready for Deletion
                    </p>

                    <p className="mt-1 text-xl font-semibold text-gray-900">
                      {cleanupDiagnostic.filesReadyForDeletion ??
                        "—"}
                    </p>
                  </div>
                </div>

                {/* ----------------------------------- */}
                {/* MIGRATION STATUS                    */}
                {/* ----------------------------------- */}

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border bg-white p-3">
                    <p className="text-xs text-gray-500">
                      Non-ImageKit Images
                    </p>

                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {cleanupDiagnostic.nonImageKitImages ??
                        "—"}
                    </p>
                  </div>

                  <div className="rounded-lg border bg-white p-3">
                    <p className="text-xs text-gray-500">
                      Legacy Storage Paths
                    </p>

                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {cleanupDiagnostic.legacyStoragePaths ??
                        "—"}
                    </p>
                  </div>

                  <div className="rounded-lg border bg-white p-3">
                    <p className="text-xs text-gray-500">
                      Unique ImageKit Paths
                    </p>

                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {cleanupDiagnostic.uniqueImageKitPaths ??
                        "—"}
                    </p>
                  </div>
                </div>

                {/* ----------------------------------- */}
                {/* AFFECTED IMAGES                     */}
                {/* ----------------------------------- */}

                {cleanupDiagnostic.affectedImages &&
                  cleanupDiagnostic
                    .affectedImages
                    .length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-red-800">
                        Affected Product Images
                      </p>

                      <div className="mt-2 max-h-64 overflow-auto rounded-lg border bg-white">
                        <table className="w-full min-w-[700px] text-left text-xs">
                          <thead className="sticky top-0 bg-gray-50">
                            <tr className="border-b">
                              <th className="px-3 py-2 font-medium text-gray-600">
                                ID
                              </th>

                              <th className="px-3 py-2 font-medium text-gray-600">
                                Image URL
                              </th>

                              <th className="px-3 py-2 font-medium text-gray-600">
                                Storage Path
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {cleanupDiagnostic.affectedImages.map(
                              (
                                image,
                                index
                              ) => (
                                <tr
                                  key={
                                    image.id ??
                                    index
                                  }
                                  className="border-b last:border-0"
                                >
                                  <td className="max-w-[150px] truncate px-3 py-2 font-mono text-gray-600">
                                    {
                                      image.id ??
                                      "—"
                                    }
                                  </td>

                                  <td className="max-w-[350px] truncate px-3 py-2 text-gray-600">
                                    {
                                      image.imageUrl ??
                                      "—"
                                    }
                                  </td>

                                  <td className="max-w-[250px] truncate px-3 py-2 font-mono text-gray-600">
                                    {
                                      image.storagePath ??
                                      "—"
                                    }
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                {/* ----------------------------------- */}
                {/* TECHNICAL DIAGNOSTIC                */}
                {/* ----------------------------------- */}

                <details className="mt-4">
                  <summary className="cursor-pointer text-xs font-medium text-gray-600">
                    Show technical diagnostic
                  </summary>

                  <pre className="mt-2 max-h-80 overflow-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-100">
                    {JSON.stringify(
                      cleanupDiagnostic,
                      null,
                      2
                    )}
                  </pre>
                </details>
              </div>
            )}

            {/* --------------------------------------- */}
            {/* ERROR                                   */}
            {/* --------------------------------------- */}

            {migrationError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-800">
                  Operation blocked
                </p>

                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-red-700">
                  {migrationError}
                </p>
              </div>
            )}

            {/* --------------------------------------- */}
            {/* STORAGE INVENTORY                       */}
            {/* --------------------------------------- */}

            {storageInventory && (
              <div className="mt-6 border-t pt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      Supabase Product Storage
                    </h4>

                    <p className="mt-1 text-xs text-gray-500">
                      These are files currently
                      inside the Supabase{" "}
                      <span className="font-mono">
                        products/
                      </span>{" "}
                      folder.
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-100 px-4 py-2 text-right">
                    <p className="text-xs text-gray-500">
                      Files found
                    </p>

                    <p className="text-lg font-semibold text-gray-900">
                      {
                        productFileCount
                      }
                    </p>
                  </div>
                </div>

                {/* ----------------------------------- */}
                {/* DELETE WARNING                       */}
                {/* ----------------------------------- */}

                {productFileCount > 0 && (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-800">
                      Old Supabase product images
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      These files are the old
                      product images that were
                      migrated to ImageKit.
                    </p>

                    <p className="mt-2 text-xs text-red-600">
                      The Edge Function will
                      verify that all current
                      product images use
                      ImageKit before deleting
                      these files.
                    </p>

                    <button
                      type="button"
                      disabled={
                        migrationLoading
                      }
                      onClick={
                        deleteOldProductImages
                      }
                      className="
                        mt-4
                        inline-flex
                        items-center
                        justify-center
                        rounded-lg
                        bg-red-600
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-red-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {migrationLoading
                        ? "Checking..."
                        : `Delete ${productFileCount} Old Product ${
                            productFileCount ===
                            1
                              ? "Image"
                              : "Images"
                          }`}
                    </button>
                  </div>
                )}

                {/* ----------------------------------- */}
                {/* FOLDER SUMMARY                       */}
                {/* ----------------------------------- */}

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {Object.entries(
                    folderCounts
                  ).map(
                    ([
                      folder,
                      count,
                    ]) => (
                      <div
                        key={folder}
                        className="rounded-xl border bg-white p-3"
                      >
                        <p className="truncate text-xs text-gray-500">
                          {folder}
                        </p>

                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {count}
                        </p>

                        <p className="text-xs text-gray-400">
                          files
                        </p>
                      </div>
                    )
                  )}
                </div>

                {/* ----------------------------------- */}
                {/* FILE LIST                            */}
                {/* ----------------------------------- */}

                <div className="mt-5 overflow-hidden rounded-xl border">
                  <div className="max-h-[500px] overflow-auto">
                    <table className="w-full min-w-[650px] text-left text-sm">
                      <thead className="sticky top-0 bg-gray-50">
                        <tr className="border-b">
                          <th className="px-4 py-3 font-medium text-gray-600">
                            File
                          </th>

                          <th className="px-4 py-3 font-medium text-gray-600">
                            Folder
                          </th>

                          <th className="px-4 py-3 font-medium text-gray-600">
                            Size
                          </th>

                          <th className="px-4 py-3 font-medium text-gray-600">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {storageInventory.files.map(
                          (file) => (
                            <tr
                              key={
                                file.path
                              }
                              className="border-b last:border-0 hover:bg-gray-50"
                            >
                              <td className="max-w-[300px] truncate px-4 py-3 font-mono text-xs text-gray-700">
                                {
                                  file.name
                                }
                              </td>

                              <td className="px-4 py-3 text-xs text-gray-500">
                                {
                                  file.folder
                                }
                              </td>

                              <td className="px-4 py-3 text-xs text-gray-500">
                                {formatFileSize(
                                  file.size
                                )}
                              </td>

                              <td className="px-4 py-3">
                                <span className="inline-flex rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                                  Old Product
                                </span>
                              </td>
                            </tr>
                          )
                        )}

                        {storageInventory.files
                          .length ===
                          0 && (
                          <tr>
                            <td
                              colSpan={
                                4
                              }
                              className="px-4 py-8 text-center text-sm text-gray-500"
                            >
                              No old
                              product
                              files
                              remain
                              in
                              Supabase
                              Storage.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="mt-3 text-xs text-gray-400">
                  Only files inside the{" "}
                  <span className="font-mono">
                    products/
                  </span>{" "}
                  folder are included in
                  this cleanup.
                </p>
              </div>
            )}
          </div>
        </SettingSection>
      </form>
    </Form>
  );
}