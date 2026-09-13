import { supabase } from "@/lib/supabase";

const VISITOR_KEY = "tnm_visitor_id";
const SESSION_KEY = "tnm_session_id";

type AnalyticsEventType = "page_view" | "product_view";

interface TrackEventPayload {
  eventType?: AnalyticsEventType;
  pagePath: string;
  productId?: string | null;
  referrer?: string | null;
}

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = createId("visitor");
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

function getSessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = createId("session");
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  if (window.innerWidth < 768) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
}

class AnalyticsService {
  private visitorId: string | null = null;
  private sessionId: string | null = null;

  private init() {
    this.visitorId ??= getVisitorId();
    this.sessionId ??= getSessionId();
  }

  async trackEvent(payload: TrackEventPayload) {
    if (typeof window === "undefined") return;

    this.init();
    if (!this.visitorId || !this.sessionId) return;

    try {
      const { error } = await supabase
        .from("website_analytics_events")
        .insert({
          visitor_id: this.visitorId,
          session_id: this.sessionId,
          event_type: payload.eventType ?? "page_view",
          page_path: (payload.pagePath || window.location.pathname).slice(0, 500),
          product_id: payload.productId ?? null,
          referrer: payload.referrer ?? document.referrer?.slice(0, 1000) ?? null,
          device_type: getDeviceType(),
        });

      if (error) console.error("Analytics tracking failed:", error);
    } catch (error) {
      console.error("Analytics tracking failed:", error);
    }
  }

  async trackPageView(pagePath = window.location.pathname) {
    return this.trackEvent({ eventType: "page_view", pagePath });
  }

  async trackProductView(productId: string, pagePath = window.location.pathname) {
    if (!productId) return;
    return this.trackEvent({
      eventType: "product_view",
      pagePath,
      productId,
    });
  }
}

export const analyticsService = new AnalyticsService();
