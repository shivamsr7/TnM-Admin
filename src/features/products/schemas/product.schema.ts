import { z } from "zod";


/*
 * =========================================================
 * PRODUCT SPECIFICATION SCHEMA
 * =========================================================
 */

const productSpecificationSchema = z.object({

  label:
    z.string().trim(),

  value:
    z.string().trim(),

});


/*
 * =========================================================
 * PRODUCT SCHEMA
 * =========================================================
 */

export const productSchema = z.object({

  /*
   * =======================================================
   * BASIC INFORMATION
   * =======================================================
   */

  name:
    z.string()
      .min(
        2,
        "Product name is required"
      ),


  slug:
    z.string()
      .min(2),


  category_id:
    z.string()
      .min(
        1,
        "Category is required"
      ),


  subcategory_id:
    z.string()
      .optional(),


  brand_id:
    z.string()
      .nullable()
      .optional(),


  short_description:
    z.string()
      .optional(),


  description:
    z.string()
      .optional(),


  care_instructions:
    z.string()
      .optional(),


  /*
   * =======================================================
   * PRODUCT SPECIFICATIONS
   * =======================================================
   *
   * These are flexible product-specific attributes.
   *
   * Example:
   *
   * [
   *   {
   *     label: "Base Metal",
   *     value: "Stainless Steel"
   *   },
   *   {
   *     label: "Plating",
   *     value: "18k Gold Tone"
   *   }
   * ]
   */

  specifications:
    z.array(
      productSpecificationSchema
    ),


  /*
   * =======================================================
   * WEIGHT & DIMENSIONS
   * =======================================================
   *
   * These are separate database columns.
   *
   * weight → kg
   * length → cm
   * width  → cm
   * height → cm
   */

  weight:
    z.number()
      .nullable()
      .optional(),


  length:
    z.number()
      .nullable()
      .optional(),


  width:
    z.number()
      .nullable()
      .optional(),


  height:
    z.number()
      .nullable()
      .optional(),


  /*
   * =======================================================
   * PRICING
   * =======================================================
   */

  cost_price:
    z.number()
      .nullable()
      .optional(),


  price:
    z.number()
      .min(
        1,
        "Price is required"
      ),


  compare_price:
    z.number()
      .nullable()
      .optional(),


  /*
   * =======================================================
   * IDENTIFICATION
   * =======================================================
   */

  sku:
    z.string()
      .optional(),


  barcode:
    z.string()
      .optional(),


  /*
   * =======================================================
   * INVENTORY
   * =======================================================
   */

  stock:
    z.number(),


  low_stock_threshold:
    z.number(),


  track_inventory:
    z.boolean(),


  allow_backorders:
    z.boolean(),


  /*
   * =======================================================
   * STATUS
   * =======================================================
   */

  status:
    z.enum([
      "draft",
      "active",
      "hidden",
      "archived",
      "out_of_stock",
    ]),


  /*
   * =======================================================
   * PRODUCT FLAGS
   * =======================================================
   */

  trending:
    z.boolean(),


  editors_pick:
    z.boolean(),


  featured:
    z.boolean(),


  new_arrival:
    z.boolean(),


  best_seller:
    z.boolean(),


  /*
   * =======================================================
   * RELATIONSHIP FIELDS
   * =======================================================
   *
   * Form-only fields.
   */

  collection_ids:
    z.array(
      z.string()
    ),


  tag_ids:
    z.array(
      z.string()
    ),


  /*
   * =======================================================
   * SEO
   * =======================================================
   */

  seo_title:
    z.string()
      .optional(),


  seo_description:
    z.string()
      .optional(),


  meta_keywords:
    z.string()
      .optional(),

});


export type ProductSchema =
  z.infer<
    typeof productSchema
  >;