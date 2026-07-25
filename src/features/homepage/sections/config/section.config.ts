import {
  FolderKanban,
  Flame,
  Sparkles,
  ShieldCheck,
  MessageSquareHeart,
  Images,
  Mail,
} from "lucide-react";

export const SECTION_CONFIG = {
  featured_collections: {
    title: "Featured Collections",
    description: "Highlight your curated jewelry collections.",
    icon: FolderKanban,
  },

  best_sellers: {
    title: "Best Sellers",
    description: "Display your most purchased products.",
    icon: Flame,
  },

  new_arrivals: {
    title: "New Arrivals",
    description: "Show recently added products.",
    icon: Sparkles,
  },

  trending_products: {
    title: "Trending Products",
    description: "Highlight currently trending products.",
    icon: Flame,
  },

  why_choose_us: {
    title: "Why Choose Us",
    description: "Show your brand's key benefits.",
    icon: ShieldCheck,
  },

  testimonials: {
    title: "Testimonials",
    description: "Customer reviews and testimonials.",
    icon: MessageSquareHeart,
  },

  instagram_feed: {
  title: "Instagram Feed",
  description: "Display your latest Instagram posts.",
  icon: Images,
},

  newsletter: {
    title: "Newsletter",
    description: "Newsletter subscription section.",
    icon: Mail,
  },
} as const;